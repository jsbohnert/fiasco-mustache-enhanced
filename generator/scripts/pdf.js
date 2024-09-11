/**
 * Generate the PDF from the current playset
 */
function generate_pdf(playsetVM)
{
  var colors = {
    primary: "#AA2222",
    secondary: "#8B1F1C",
    tertiary: "#D08484"
  };

  if (playsetVM.optionColorPrimary()) {
    colors.primary = playsetVM.optionColorPrimary();
  }
  if (playsetVM.optionColorSecondary()) {
    colors.secondary = playsetVM.optionColorSecondary();
  }
  if (playsetVM.optionColorSubtle()) {
    colors.tertiary = playsetVM.optionColorSubtle();
  }

  var docDefinition = {
    content: [ ],
    styles: get_pdf_style(colors)
  };

  if (playsetVM.isCoverLoaded())
  {
    pdf_add_cover(docDefinition.content, playsetVM.playsetCover());
  }

  pdf_add_description(docDefinition.content, playsetVM);

  // Generation of the Sections (Relationships, Needs, Locations, Objects)
  for(var iSection = 0; iSection < playsetVM.sections().length; iSection++)
  {
    var currentSection = playsetVM.sections()[iSection];
    pdf_add_section(docDefinition.content, currentSection, playsetVM.playsetTeaser(), playsetVM.playsetTitle(), playsetVM);
  }

  pdf_add_instasetup(docDefinition.content, playsetVM);
  pdf_add_aftermath(docDefinition.content, playsetVM);

  var customFilename = "Fiasco Playset - " + playsetVM.playsetTitle() + ".pdf";
  //console.log(JSON.stringify(docDefinition));
  pdfMake.createPdf(docDefinition).download(customFilename);
}

/**
 * [pdf_add_introduction description]
 * @param {[type]} content     [description]
 * @param {[type]} jsonPlayset [description]
 */
function pdf_add_description(content, playsetVM)
{
  // Title page with credits
  content.push({ text: playsetVM.playsetTitle(), style: 'title', pageOrientation: 'portrait'});
  var creditsBlocks = divideText_intoBlocks_titleParagraph(playsetVM.playsetCredits());

  content.push({ text: playsetVM.languageManager.current().section_credits, style: 'subTitle' });
  for(var iBlock = 0; iBlock < creditsBlocks.length; iBlock++)
  {
    var block = { "style": "description", "text": creditsBlocks[iBlock].content };
    if (creditsBlocks[iBlock].type == 'title') {
      block.style = 'subTitle';
    }
    content.push(block);
  }

  var boilerplateBlocks = divideText_intoBlocks_titleParagraph(playsetVM.playsetBoilerplate());
  content.push({ text: playsetVM.languageManager.current().section_boilerplate, style: 'subTitle' });
  for(var iBlock = 0; iBlock < boilerplateBlocks.length; iBlock++)
  {
    var block = { "style": "description", "text": boilerplateBlocks[iBlock].content };
    if (boilerplateBlocks[iBlock].type == 'title') {
      block.style = 'subTitle';
    }
    content.push(block);
  }

  // Description page
  content.push({ text: playsetVM.languageManager.current().section_thescore, style: 'title' , pageBreak: 'before'});
  content.push({ text: playsetVM.playsetSubtitle(), style: 'subTitle', pageOrientation: 'portrait' });
  var descriptionBlocks = divideText_intoBlocks_titleParagraph(playsetVM.playsetDescription());
  for(var iBlock = 0; iBlock < descriptionBlocks.length; iBlock++)
  {
    var blockStyle = 'description';
    switch(descriptionBlocks[iBlock].type)
    {
      case 'title':
        blockStyle = 'subTitle';
        break;
      case 'paragraph':
        blockStyle = 'description';
        break;
    }
    if (descriptionBlocks[iBlock].type == 'pageBreaker') {
      content.push({ text: '', pageBreak: "after", pageOrientation: "portrait" });
    } else {
      content.push({ text: descriptionBlocks[iBlock].content, style: blockStyle });
    }
  }

  // Movie Night
  content.push({ text: playsetVM.languageManager.current().section_movienight, style: 'subTitle', pageOrientation: 'portrait'});
  content.push({ text: playsetVM.playsetMovieNight(), style: blockStyle});
}

function pdf_add_cover(content, dataUrl)
{
  content.push({ image: dataUrl, width: 500, pageBreak: 'after' });
}

/**
 * Add the Sections part for the PDF generation
 * @param {json} content       Json data for pdfmake generation
 * @param {json} jsonSection   Json data for the Section description
 * @param {string} playsetTeaser Teaser (bottom description) for the playset
 */
function pdf_add_section(content, sectionVM, playsetTeaser, playsetTitle, playset)
{
  if (!sectionVM.isEnabled())
  {
    return;
  }
  content.push({ text: playsetTitle, style: 'titleOnHeader', pageBreak: 'before', pageOrientation: 'landscape' });
  content.push({ text: sectionVM.title() + " ...", style: 'sectionHeader' });

  var columns = [ ];
  var iColumn = 0;
  // For each category of the page, add the 6 Details and put it in the right column
  for (var iCategory = 0; iCategory < sectionVM.categories().length; iCategory++)
  {
    if ((iCategory % 3) == 0)
    {
      columns.push([ ]);
      iColumn = columns.length - 1;
    }

    var currentCategory = sectionVM.categories()[iCategory];
    columns[iColumn].push({ text: (iCategory + 1) + " - " + currentCategory.title(), style: 'category' } );
    columns[iColumn].push({
       table: {
          headerRows: 0,
          widths: [6, 14, '*'],
          body: [
            [
              {text: ""},
              {image: playset.dice1(), width: 12},
              {text: currentCategory.items()[0].textValue(), style: 'details'}
            ],
            [
              {text: ""},
              {image: playset.dice2(), width: 12},
              {text: currentCategory.items()[1].textValue(), style: 'details'}
            ],
            [
              {text: ""},
              {image: playset.dice3(), width: 12},
              {text: currentCategory.items()[2].textValue(), style: 'details'}
            ],
            [
              {text: ""},
              {image: playset.dice4(), width: 12},
              {text: currentCategory.items()[3].textValue(), style: 'details'}
            ],
            [
              {text: ""},
              {image: playset.dice5(), width: 12},
              {text: currentCategory.items()[4].textValue(), style: 'details'}
            ],
            [
              {text: ""},
              {image: playset.dice6(), width: 12},
              {text: currentCategory.items()[5].textValue(), style: 'details'}
            ]
          ],
       },
       layout: "noBorders"
     });

  }
  content.push({ columns: columns });
  content.push({ text: "... " + playsetTeaser, style: 'sectionFooter' });
}

/**
 * Add the Insta-Setup Section part for the PDF generation
 * @param {json} content       Json data for pdfmake generation
 * @param {json} playsetVM     ViewModel of the Playset
 */
function pdf_add_instasetup(content, playsetVM)
{
  if ( !playsetVM.instasetup().instasetupEnabled())
  {
    return;
  }
  content.push({ text: playsetVM.playsetTitle(), style: 'titleOnHeader', pageBreak: 'before', pageOrientation: 'portrait' });
  content.push({ text: playsetVM.languageManager.current().instasetup_title, style: 'title' });

  // First section
  content.push({ text: playsetVM.instasetup().firstSection().title(), style: 'instaSetupSection' });
  content.push({ text: playsetVM.languageManager.current().instasetup_for3, style: 'category' });
  pdf_add_instasetup_detail(content, playsetVM.instasetup().firstSectionChoice1());
  pdf_add_instasetup_detail(content, playsetVM.instasetup().firstSectionChoice2());
  pdf_add_instasetup_detail(content, playsetVM.instasetup().firstSectionChoice3());
  content.push({ text: playsetVM.languageManager.current().instasetup_for4, style: 'category' });
  pdf_add_instasetup_detail(content, playsetVM.instasetup().firstSectionChoice4());
  content.push({ text: playsetVM.languageManager.current().instasetup_for5, style: 'category' });
  pdf_add_instasetup_detail(content, playsetVM.instasetup().firstSectionChoice5());

  // Second section
  content.push({ text: playsetVM.instasetup().secondSection().title(), style: 'instaSetupSection' });
  content.push({ text: playsetVM.languageManager.current().instasetup_for3, style: 'category' });
  pdf_add_instasetup_detail(content, playsetVM.instasetup().secondSectionChoice1());
  content.push({ text: playsetVM.languageManager.current().instasetup_for45, style: 'category' });
  pdf_add_instasetup_detail(content, playsetVM.instasetup().secondSectionChoice2());

  // Third section
  content.push({ text: playsetVM.instasetup().thirdSection().title(), style: 'instaSetupSection' });
  content.push({ text: playsetVM.languageManager.current().instasetup_for34, style: 'category' });
  pdf_add_instasetup_detail(content, playsetVM.instasetup().thirdSectionChoice1());
  content.push({ text: playsetVM.languageManager.current().instasetup_for5, style: 'category' });
  pdf_add_instasetup_detail(content, playsetVM.instasetup().thirdSectionChoice2());

  // Fourth section
  content.push({ text: playsetVM.instasetup().fourthSection().title(), style: 'instaSetupSection' });
  content.push({ text: playsetVM.languageManager.current().instasetup_forany, style: 'category' });
  pdf_add_instasetup_detail(content, playsetVM.instasetup().fourthSectionChoice1());

  content.push({ text: "... " + playsetVM.playsetTeaser(), style: 'sectionFooter' });
}

function pdf_add_instasetup_detail(content, detail)
{
  content.push({ text: detail.categoryVM().title() + " - " + detail.textValue(), style: 'details' });
}

/**
 * Add the Insta-Setup Section part for the PDF generation
 * @param {json} content       Json data for pdfmake generation
 * @param {json} playsetVM     ViewModel of the Playset
 */
function pdf_add_aftermath(content, playsetVM)
{
  var aftermath = playsetVM.aftermath();

  if ( !aftermath.aftermathEnabled())
  {
    return;
  }
  content.push({ text: playsetVM.playsetTitle(), style: 'titleOnHeader', pageBreak: 'before', pageOrientation: 'portrait' });
  content.push({ text: aftermath.tableOneName(), style: 'title' });
  for (var iTableRow = 0; iTableRow < aftermath.tableOneEntries().length; iTableRow++)
  {
    var title = aftermath.tableOneEntries()[iTableRow].title().trim();
    var desc = aftermath.tableOneEntries()[iTableRow].desc().trim();
    if (title.length == 0 && desc.length == 0 ) 
    {
      continue;
    }
    pdf_add_aftermath_line(content, iTableRow, title, desc)

  }

  
  if (!aftermath.tableTwoEnabled()) {
    return;
  }
  content.push({ text: playsetVM.playsetTitle(), style: 'titleOnHeader', pageBreak: 'before', pageOrientation: 'portrait' });
  content.push({ text: aftermath.tableTwoName(), style: 'title' });
  
  for (var iTableRow = 0; iTableRow < aftermath.tableTwoEntries().length; iTableRow++)
    {
      var title = aftermath.tableTwoEntries()[iTableRow].title().trim();
      var desc = aftermath.tableTwoEntries()[iTableRow].desc().trim();
      if (title.length == 0 && desc.length == 0 ) 
      {
        continue;
      }
      pdf_add_aftermath_line(content, iTableRow, title, desc)
    }
}

function pdf_add_aftermath_line(content, idx, title, desc) {
  if (title.length == 0 && desc.length == 0 ) 
    {
      return;
    }

    if (idx >  0) {
      content.push({text: ' ', style: 'spacerLine'});
    }
    content.push({text: [
  
      {text: title, style: 'leadingText'},
      '  ',
      {text: desc}
    ]});
}

/**
 * Get the style for the pdfmake generation
 * @return {json} Json for pdfmake styling
 */
function get_pdf_style(colors)
{
  var styles = {
    titleOnHeader: {
      fontSize: 10,
      font: "BowlbyOneSC",
      marginTop: -10,
      color: colors.tertiary,
      alignment: 'right'
    },
    sectionHeader: {
      fontSize: 26,
      font: "BowlbyOneSC",
      marginBottom: 2,
      marginTop: -10,
      color: colors.secondary
    },
    sectionFooter: {
      fontSize: 16,
      font: "BowlbyOneSC",
      color: colors.secondary,
      alignment: 'right',
      marginTop: 4,
      marginBottom: 2
    },
    instaSetupSection: {
      fontSize: 26,
      font: "BowlbyOneSC",
      marginBottom: 0,
      marginTop: 5,
      color: colors.secondary,
    },
    category: {
      fontSize: 16,
      font: "BowlbyOneSC",
      marginLeft: 10,
      marginTop: 5,
      marginBottom: 2,
    },
    details: {
      fontSize: 12,
      marginLeft: 2,
      marginTop: 1
    },
    title: {
      fontSize: 32,
      font: "BowlbyOneSC",
      marginBottom: 8,
      color: colors.primary,
      alignment: 'center'
    },
		subTitle: {
			fontSize: 26,
			font: "BowlbyOneSC",
			marginLeft: 10,
      marginTop: 4
		},
    description: {
      fontSize: 16,
			marginBottom: 18,
      alignment: 'justify'
    },
    spacerLine: {
      fontSize: 6
    },
    leadingText: {
      marginTop: 2,
      bold: true
    }
  };
  return styles;
}
