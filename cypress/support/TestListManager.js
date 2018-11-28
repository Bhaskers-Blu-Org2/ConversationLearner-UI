/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

const createModels = require('../tests/CreateModels')
const train = require('../tests/Train')
const log = require('../tests/Log')
const editAndBranching = require('../tests/EditAndBranching')
const helpers = require('./Helpers')
const path = require('path')
const pathParse = require('path-parse')

// ************ MODIFY THIS LIST *****************************************
// This is the list of tests that will be executed when "RunTestsFromList"
// is selected from the Cypress Test GUI.
export const testList =
[
  "EditAndBranching.Branching",
]

// Do NOT alter this list except to add in new test cases as they are created.
export const masterListOfAllTestCases = 
[
  "CreateModels.AllEntityTypes",
  "CreateModels.DisqualifyingEntities",
  "CreateModels.WaitVsNoWaitActions",
  "CreateModels.WhatsYourName",
  "EditAndBranching.VerifyEditTrainingControlsAndLabels",
  "EditAndBranching.Branching",
  "Log.WhatsYourName",
  "Train.DisqualifyingEntities",
  "Train.WaitVsNoWaitActions",
  "Train.WhatsYourName1",
  "Train.WhatsYourName2",
]

// The lists above are in a format that is convenient for a developer to copy
// and paste in order to create a list of tests.
//
// This next list has all the details needed for creating the test for Cypress.
const testGroups =
[
  {
    name: 'CreateModels', tests:
      [
        { name: "All Entity Types", func: createModels.AllEntityTypes },
        { name: "Disqualifying Entities", func: createModels.DisqualifyingEntities },
        { name: "Wait vs No Wait Action Tests", func: createModels.WaitVsNoWaitActions },
        { name: "What's Your Name", func: createModels.WhatsYourName },
      ]
  },
  {
    name: 'EditAndBranching', tests:
      [
        { name: "Verify Edit Training Controls and Labels", func: editAndBranching.VerifyEditTrainingControlsAndLabels },
        { name: "Branching", func: editAndBranching.Branching },
      ]
  },
  {
    name: 'Log', tests:
      [
        { name: "What's Your Name", func: log.WhatsYourName },
      ]
  },
  {
    name: 'Train', tests:
      [
        { name: "Disqualifying Entities", func: train.DisqualifyingEntities },
        { name: "Wait vs No Wait Action", func: train.WaitVsNoWaitActions },
        { name: "What's Your Name 1", func: train.WhatsYourName1 },
        { name: "What's Your Name 2", func: train.WhatsYourName2 },
      ]
  },
]

export function AddToCypressTestList(testList) 
{
  var funcName = `AddToCypressTestList()`
  helpers.ConLog(funcName, `List of Tests: ${testList}`)
  
  if (!Array.isArray(testList)) testList = [testList]
  
  var testListIterator = new TestListIterator(testList)
  
  var test = testListIterator.next
  while (test != undefined)
  {
    helpers.ConLog(funcName, `Adding Group: ${test.group}`)
    describe(test.group, () =>
    {
      var currentGroupName = test.group
      while (test != undefined && test.group == currentGroupName)
      {
        helpers.ConLog(funcName, `Adding Test Case: ${test.name}`)
        it(test.name, test.func)
        test = testListIterator.next
      }
    })
  }
}

class TestListIterator
{
  constructor(testList)
  {
    this.testList = testList
    this.index = 0
    this.currentGroup = {name: ''}
  }

  // groupName.testName - 'testName' from 'groupName'
  // TODO: Add support for these wild card versions
  // *.*                - All Groups, All Tests
  // *.testName         - All tests with all groups matching 'testName'
  // groupName.*        - All tests from 'groupName'
  get next()
  {
    if (this.index >= this.testList.length) return undefined

    var x = this.testList[this.index].split('.')
    if (x.length != 2) throw `Invalid item in testList[${this.index}]: "${this.testList[this.index]}" - 'group DOT testName' format is expected`
    var groupName = x[0]
    var testName = x[1]

    if (this.currentGroup.name != groupName)
    {
      this.currentGroup = GetTestGroup(groupName)
      if (this.currentGroup == undefined) throw `Group '${groupName}' NOT found in testGroups`
    }
    
    var test = GetTest(this.currentGroup, testName)
    if (test == undefined) throw `Test '${testName}' NOT found in test group '${groupName}'`

    this.index++
    return {group: this.currentGroup.name, name: test.name, func: test.func}
  }
}

function GetTestGroup(name)
{
  for (var i = 0; i < testGroups.length; i++)
  {
    if (testGroups[i].name == name) 
    {
      return testGroups[i]
    }
  }
  return undefined
}

function GetTest(testGroup, testNameToFind)
{
  var toFind = `function ${testNameToFind}(`
  for (var i = 0; i < testGroup.tests.length; i++)
  {
    if (`${testGroup.tests[i].func}`.startsWith(toFind)) 
    {
      return testGroup.tests[i]
    }
  }
  return undefined
}

