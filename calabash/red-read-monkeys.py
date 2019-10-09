# -*- coding: utf-8 -*-

import subprocess
import os
import json
from pathlib import Path
from bson.objectid import ObjectId
from pymongo import MongoClient
import datetime
from subprocess import Popen, PIPE
import time
import re

db_connection = os.environ['miso4208_exam1_db']
db_name = db_connection.split("/")[-1]

calabash_test_dir = './'
calabash_app_dir = '/Users/garzon/Desktop/calabash/'
calabash_features_dir = '/Volumes/Development/Code/pruebas/exam1/exam1-web-app/calabash-features/'


def executeMonkeyTest(test, client):
    print 'trying execute test'
    test['status'] = "in-progress"
    db = client[db_name]
    monkey_tests = db.monkey_tests
    monkey_tests.update({'_id': test['_id']}, {
                        '$set': {'status': 'in-progress', 'start': datetime.datetime.now()}})
    # Execute monkeys
    command = ['adb', 'shell', 'monkey', '-p',
               test['package'], '-v', str(test['monkeys'])]
    p = Popen(command, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    output, err = p.communicate(
        b"input data that is passed to subprocess' stdin")
    rc = p.returncode
    print 'test completed!' + output + err + str(rc)
    if rc == 1:
        monkey_tests.update({'_id': test['_id']}, {'$set': {
                            'status': 'completed', 'end': datetime.datetime.now(), 'error': err.replace("error: ", "")}})
        client.close()
        return False
    else:
        seed = int(re.findall(r'\bseed=\w+', output)[0].split("=")[1])
        monkey_tests.update({'_id': test['_id']}, {'$set': {
                            'status': 'completed', 'end': datetime.datetime.now(), 'error': None, 'seed': seed}})
        client.close()
        return True


def executeCalabashTest(test, client):
    print 'trying execute calabash test'
    db = client[db_name]
    cases = db.calabashfeaturemodels
    tests = db.monkey_tests
    case = cases.find_one({'_id': ObjectId(test['calabash_case'])})
    # tests.update({'_id': test['_id']}, {
    #                   '$set': {'status': 'in-progress', 'start': datetime.datetime.now()}})
    # removes previous tests
    command = ['cp', calabash_features_dir +
               case['file_name'], calabash_test_dir+'features']
    Popen(command, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    ex_command = ['calabash-android', 'run',
                  calabash_app_dir+'/RedReader-limpia.apk']
    #ex_command = ['cd', calabash_test_dir, '&&', 'mkdir', 'aja']
    p = Popen(ex_command, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    output, err = p.communicate(
        b"input data that is passed to subprocess' stdin")
    os.remove(calabash_test_dir+'features/'+case['file_name'])

    scenario_str = re.findall(
        r'[0-9]+ scenario \([0-9]+ passed\)', output)[0].split(" ")
    scenario = scenario_str[0]
    scenario_passed = scenario_str[2].replace("(", "")

    steps_str = re.findall(
        r'[0-9]+ steps \([0-9]+ passed\)', output)[0].split(" ")
    steps = steps_str[0]
    steps_passed = steps_str[2].replace("(", "")


    tests.update({'_id': test['_id']}, {
        '$set': {'status': 'completed', 'end': datetime.datetime.now(), 'calabash_result': {'log': output, 'scenarios': scenario, 'passed_scenarios': scenario_passed, 'steps': steps, 'passed_steps': steps_passed}}})
    client.close()
    # print(output)


def lookForTest():
    client = MongoClient(db_connection+'?retryWrites=false')
    db = client[db_name]
    monkey_tests = db.monkey_tests
    current_test = monkey_tests.find_one({'status': 'new'})
    return current_test, client


def main():
    while True:
        test, client = lookForTest()
        if test:
            print 'test found of type: ' + str(test['type'])
            if test['type'] == 'monkey':
                result = executeMonkeyTest(test, client)
            if test['type'] == 'calabash':
                result = executeCalabashTest(test, client)
            print 'test completed with result ' + str(result)
        else:
            print "nothing... waiting"
            time.sleep(30)


main()
