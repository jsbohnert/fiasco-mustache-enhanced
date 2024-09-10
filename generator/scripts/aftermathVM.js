function aftermathItem(title, desc) {
  var self = this;
  self.title = ko.observable(title);
  self.desc = ko.observable(desc);
}

function aftermathVM(playset) {

  var self = this;

  self.playsetVM = ko.observable(playset);
  self.aftermathEnabled = ko.observable(false);
  self.tableOneName = ko.observable("Aftermath: Black High");
  self.tableTwoName = ko.observable("Aftermath: White High");
  self.tableTwoEnabled = ko.observable(true);

  self.tableOneEntries =  ko.observableArray([
    new aftermathItem("Zero: The worst thing in the universe.", ""),
    new aftermathItem("Black One: Horrible.", ""),
    new aftermathItem("Black Two: Brutal.", ""),
    new aftermathItem("Black Three: Harsh.", ""),
    new aftermathItem("Black Four: Savage.", ""),
    new aftermathItem("Black Five: Rough.", ""),
    new aftermathItem("Black 6-7: Pathetic.", ""),
    new aftermathItem("Black 8-9: Nothing to write home about.", ""),
    new aftermathItem("Black 10-12: Pretty good.", ""),
    new aftermathItem("Black 13+: Awesome.", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", "")
  ]);

  self.tableTwoEntries =  ko.observableArray([
    new aftermathItem("Zero: The worst thing in the universe.", ""),
    new aftermathItem("White One: Dreadful.", ""),
    new aftermathItem("White Two: Merciless.", ""),
    new aftermathItem("White Three: Grim.", ""),
    new aftermathItem("White Four: Bitter.", ""),
    new aftermathItem("White Five: Miserable.", ""),
    new aftermathItem("White 6-7: Weak.", ""),
    new aftermathItem("White 8-9: Nothing to crow about.", ""),
    new aftermathItem("White 10-12: Not too shabby.", ""),
    new aftermathItem("White 13+: Fan-fucking-tastic.", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", ""),
    new aftermathItem("", "")
  ]);

  /* Returns the Insta-Setup indexes to be saved in the Json file */
  self.toJson = function() {
    var jsonAM = { };
    jsonAM.aftermathEnabled=self.aftermathEnabled();
    jsonAM.tableOneName=self.tableOneName();
    jsonAM.tableTwoName=self.tableTwoName();
    jsonAM.tableTwoEnabled = self.tableTwoEnabled();
    jsonAM.tableOneEntries = [];
    for (var idx=0; idx<self.tableOneEntries().length; idx += 1) {
      jsonAM.tableOneEntries.push({title: self.tableOneEntries()[idx].title(), desc: self.tableOneEntries()[idx].desc()});
    }
    jsonAM.tableTwoEntries = [];
    for (var idx=0; idx<self.tableTwoEntries().length; idx += 1) {
      jsonAM.tableTwoEntries.push({title: self.tableTwoEntries()[idx].title(), desc: self.tableTwoEntries()[idx].desc()});
    }

    return jsonAM;
  }


  self.fromJson = function(json) {
    if (json != null) {
      self.aftermathEnabled(json.aftermathEnabled);
      self.tableOneName(json.tableOneName);
      self.tableTwoName(json.tableTwoName);
      self.tableTwoEnabled(json.tableTwoEnabled);
      //empty the cells
      for (var idx=0; idx<self.tableOneEntries().length; idx += 1) {
        self.tableOneEntries()[idx].title("");
        self.tableOneEntries()[idx].desc("");
      }
      for (var idx=0; idx<self.tableTwoEntries().length; idx += 1) {
        self.tableTwoEntries()[idx].title("");
        self.tableTwoEntries()[idx].desc("");
      }

      //fill the cells
      for (var idx=0; idx<json.tableOneEntries.length; idx += 1) {
        self.tableOneEntries()[idx].title(json.tableOneEntries[idx].title);
        self.tableOneEntries()[idx].desc(json.tableOneEntries[idx].desc);
      }
      for (var idx=0; idx<json.tableTwoEntries.length; idx += 1) {
        self.tableTwoEntries()[idx].title(json.tableTwoEntries[idx].title);
        self.tableTwoEntries()[idx].desc(json.tableTwoEntries[idx].title);
      }
    }
  }
}
