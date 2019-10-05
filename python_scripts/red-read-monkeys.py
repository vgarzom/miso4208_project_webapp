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


def executeTest(test, client):
    print 'trying execute test'
    test['status'] = "in-progress"
    db = client[db_name]
    monkey_tests = db.monkey_tests
    monkey_tests.update({'_id': test['_id']}, {
                        '$set': {'status': 'in-progress', 'start': datetime.datetime.now()}})
    # Execute monkeys
    command = ['/opt/Android/Sdk/platform-tools/adb', 'shell', 'monkey', '-p',
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
            print 'test found with monkeys: ' + str(test['monkeys'])
            result = executeTest(test, client)
            print 'test completed with result ' + str(result)
        else:
            print "nothing... waiting"
            time.sleep(30)


main()
