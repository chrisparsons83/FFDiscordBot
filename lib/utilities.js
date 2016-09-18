exports.chooseOne = function (chooseList) {
    return new Promise(function (resolve, reject) {
        // Create array from string
        chooseListArray = chooseList.split(',');
        resolve(chooseListArray[Math.floor(Math.random() * chooseListArray.length)]);
    });
}