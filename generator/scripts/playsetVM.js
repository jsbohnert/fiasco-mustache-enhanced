function defaultSectionTitleByIndex(lang, idx) {
  switch(idx) {
    case 1:
      return lang.category_relationships;
      break;
    case 2:
      return lang.category_needs;
      break;
    case 3:
      return lang.category_objects;
      break;
    case 4:
      return lang.category_locations;
      break;
    case 5:
      return lang.category_tilt;
      break;
    default:
      return `Section #${idx}`
  }
}

function sectionHideableByIndex(idx) {
  switch(idx) {
    case 5:
      return true;
      break;
    default:
      return false;
  }
}

function sectionEnabledByIndex(idx) {
  switch(idx) {
    case 5:
      return false;
      break;
    default:
      return true;
  }
}

function playsetVM(lngManager, diceFiles) {

  var self = this;

  self.languageManager = lngManager;

  /* Introduction Section - Description of Playset */
  self.playsetTitle = ko.observable('Playset Title');
  self.playsetSubtitle = ko.observable('Playset Subtitle');
  self.playsetTeaser = ko.observable('Playset Teaser');
  self.playsetDescription = ko.observable('');
  self.playsetCredits = ko.observable('Made via Fiasco-Mustache');
  self.playsetBoilerplate = ko.observable('Fiasco is Bully Pulpit Games production.');
  self.playsetMovieNight = ko.observable('Films to watch');
  self.playsetCover = ko.observable(null);
  self.dice1 = ko.observable(diceFiles["dice1"]);
  self.dice2 = ko.observable(diceFiles["dice2"]);
  self.dice3 = ko.observable(diceFiles["dice3"]);
  self.dice4 = ko.observable(diceFiles["dice4"]);
  self.dice5 = ko.observable(diceFiles["dice5"]);
  self.dice6 = ko.observable(diceFiles["dice6"]);
  self.optionColorPrimary = ko.observable("#AA2222");
  self.optionColorSecondary = ko.observable("#8B1F1C");
  self.optionColorSubtle = ko.observable("#D08484");

  /* Sections of Categories / Items */
  self.sections = ko.observableArray([]);
  for(var iSection = 1; iSection <= 5; iSection++) {
    var section = new sectionVM(defaultSectionTitleByIndex(self.languageManager.current(), iSection), iSection,
      {
        hideable: sectionHideableByIndex(iSection),
        isEnabled: sectionEnabledByIndex(iSection)
      });
    self.sections.push(section);
  }

  /* Insta-Setup */
  var setup = new instasetupVM(self);
  self.instasetup = ko.observable(setup);
  var aftermath = new aftermathVM(self);
  self.aftermath = ko.observable(aftermath);

  /**********************/
  /* Sections of the UI */
  /**********************/
  /* Displaying-Hiding sections */
  self.displayedSections = ko.observableArray([]);
  self.displayedSections.push(new displayedSectionVM('Introduction', 'Intro', true));
  for(var iSection = 0; iSection < self.sections().length; iSection++) {
    self.displayedSections.push(self.sections()[iSection].displayedSection());
  }
  self.displayedSections.push(new displayedSectionVM(self.languageManager.current().instasetup_title, 'InstaSetup', false));
  self.displayedSections.push(new displayedSectionVM(self.languageManager.current().aftermath_title, 'Aftermath', false));
  self.displayedSections.push(new displayedSectionVM('Options', 'Options', false));
  self.displayedSections.push(new displayedSectionVM('About', 'About', false));

  /* Hide all the sections */
  self.hideSections = function() {
    for(var iDisplayedSection = 0; iDisplayedSection < self.displayedSections().length; iDisplayedSection++) {
      var displayedSection = self.displayedSections()[iDisplayedSection];
      displayedSection.isVisible(false);
    }
  }
  for(var iDisplayedSection = 0; iDisplayedSection < self.displayedSections().length; iDisplayedSection++) {
    var displayedSection = self.displayedSections()[iDisplayedSection];
    displayedSection.hideOthers = function() { self.hideSections(); }
  }
  /* Special Sections Visiblity */
  self.isSectionVisible = function(code) {
    for(var iDisplayedSection = 0; iDisplayedSection < self.displayedSections().length; iDisplayedSection++) {
      var displayedSection = self.displayedSections()[iDisplayedSection];
      if (displayedSection.code() == code) { return displayedSection.isVisible(); }
    }
    return false;
  }
  self.isIntroductionVisible = ko.pureComputed(function() { return self.isSectionVisible('Intro'); }, self);
  self.isInstaSetupVisible = ko.pureComputed(function() { return self.isSectionVisible('InstaSetup'); }, self);
  self.isAftermathVisible = ko.pureComputed(function() { return self.isSectionVisible('Aftermath'); }, self);
  self.isOptionsVisible = ko.pureComputed(function() { return self.isSectionVisible('Options'); }, self);
  self.isAboutVisible = ko.pureComputed(function() { return self.isSectionVisible('About'); }, self);

  self.getSectionByNumber = function(number) {
    for(var iSection = 0; iSection < self.sections().length; iSection++) {
      if (self.sections()[iSection].number() == number) return self.sections()[iSection];
    }
    return null;
  }

  /********************/
  /* Cover management */
  /********************/
  self.isCoverLoaded = ko.pureComputed(function() { return self.playsetCover() != null; });
  self.isWithNoCover = ko.pureComputed(function() { return self.playsetCover() == null; });
  self.loadCover = function() {
    $("#cover-load").click();
  }

  /*********************************/
  /* Loading from & Saving to Json */
  /*********************************/
  /* Open the "Select a File" window */
  self.loadPlayset = function() {
    $("#file-load").click();
  }
  self.savePlayset = function() {
    var blob = new Blob([JSON.stringify(get_json_fromPlaysetVM(self, false, false))], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "fiasco_template_" + self.playsetTitle() + ".json");
  }

  /* Process the loaded file into the ViewModel */
  self.updateFromJson = function(jsonData) {
    if (jsonData != undefined) {
      // General description
      self.playsetTitle(jsonData.title);
      self.playsetSubtitle(jsonData.subtitle);
      self.playsetTeaser(jsonData.teaser);
      if (jsonData.cover != undefined) {
        self.playsetCover(jsonData.cover);
      }
      if (jsonData.description != undefined) {
        self.playsetDescription(jsonData.description);
      } else { // Load old version of Playsets
        self.playsetDescription(get_oldDescription_toNewFormat(jsonData));
      }
      self.playsetCredits(jsonData.credits);
      self.playsetBoilerplate(jsonData.boilerplate);
      self.playsetMovieNight(jsonData.movienight);
      self.optionColorPrimary(jsonData.optionColorPrimary);
      self.optionColorSecondary(jsonData.optionColorSecondary);
      self.optionColorSubtle(jsonData.optionColorSubtle);


      // Sections / Categories / Details
      for(var iSection = 0; iSection < jsonData.sections.length; iSection++){
        var jsonSection = jsonData.sections[iSection];
        var sectionVM = self.sections()[iSection];
        sectionVM.titleValue(jsonSection.label);
        sectionVM.isEnabled(jsonSection.isEnabled);
        for(var iCategory = 0; iCategory < jsonSection.categories.length; iCategory++) {
          var jsonCategory = jsonSection.categories[iCategory];
          var categoryVM = sectionVM.categories()[iCategory];
          categoryVM.title(jsonCategory.label);
          for(var iDetail = 0; iDetail < jsonCategory.details.length; iDetail++) {
            var jsonDetail = jsonCategory.details[iDetail];
            var detailVM = categoryVM.items()[iDetail];
            detailVM.textValue(jsonDetail.label);
          }
        }
      }
      self.instasetup().fromJson(jsonData.instasetup);
      self.aftermath().fromJson(jsonData.aftermath);
    }
  };

}

function get_oldDescription_toNewFormat(jsonData)
{
  var migratedDescription = '';
  var blockSep = '';

  if (jsonData.hasOwnProperty("description") && (jsonData.description.length > 0))
  {
    migratedDescription += blockSep + jsonData.description;
    blockSep = '\n';
  }

  if (jsonData.hasOwnProperty("presentation") && (jsonData['presentation'].length > 0))
  {
    migratedDescription += blockSep + "# Presentation\n" + jsonData['presentation'];
    blockSep = '\n';
  }
  if (jsonData.hasOwnProperty("inspirations") && (jsonData['inspirations'].length > 0))
  {
    migratedDescription += blockSep + "# Inspirations\n" + jsonData['inspirations'];
    blockSep = '\n';
  }
  if (jsonData.hasOwnProperty("advices") && (jsonData['advices'].length > 0))
  {
    migratedDescription += blockSep + "# Advices\n" + jsonData['advices'];
    blockSep = '\n';
  }

  return migratedDescription;
}
