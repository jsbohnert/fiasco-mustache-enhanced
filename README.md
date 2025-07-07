# fiasco-mustache
 A Fiasco Playset generator !

## What is Fiasco-Mustache ?

"Fiasco-Mustache" is a project made in order to easily produce playsets for [Fiasco](http://www.bullypulpitgames.com/games/fiasco/), the game by Bully Pulpit Game.

This project is a web-page, with no server-related code, so everyone can get a local copy and test it with any web-browser. The name comes from a distinct library used to generate the playset : [Mustache](https://mustache.github.io/). The current version doesn't make much use of the Mustache library, but the name stuck.

## What's with the "Enhanced" ?

Well, this actual site you're visiting now is what happened after someone else found the original fiasco-mustache project [here](http://gulix.github.io/fiasco-mustache/), got obsessed with how cool it was, and started making some tiny QOL changes. Once he got carried away with new ideas long past the point where it seemed like he was fixing bugs and more like he was adding all kinds of extra functionality that the original author might not even desire, he decided to just mount the project here and give as much gratitude as he could to the original author who made such a cool and versatile authoring tool possible.

Wherever possible, the original author's words and text are kept exactly as they were, with changes only as necessary to make sure this project is clearly identifying itself as a change from the original, and to honor the license while removing "I" references which could be confusing as impersonating the original author.


Notable improvements include:

* More customizable sections
* Multiple page layouts available
* Improved formatting in the new 'Fiasco style' layout, including dice images mimicking the official playsets
 

## How to use Fiasco-Mustache ?

You can download the last version of the code source, or use it directly at the [hosted page](https://jsbohnert.github.io/fiasco-mustache-enhanced/).

Fill in any blank fields you want on the first page.

You may add a image for the Cover of your Playset by clicking the placeholder "+" image. 

There's a "Save" button that you can use to save your work in a local JSON file. You can then use the "Load" button to restore your work.

The tabs represent individual sections of a Fiasco playset, and the traditional sections are titled by default. (Relationships, Needs, etc). You may change the names of these sections to customize your playset.

Some common but not required sections (Tilt Table, Insta-Setup, Aftermath) can be individually enabled/disabled on their tabs if you dont want them in your Playset.

The optional Aftermath table can have one or two tables (a common choice in many community playsets)

The "Options" tab contains some special settings, like color and choosing page layout styled - play around to see what works best for your content!

The final step is to produce your playset. Click on the "Generate PDF" button to get a nice PDF ready to be print and published !

## Licenses

"Fiasco-Mustache" and "Fiasco-Mustache-Enhanced" is released under the [CC-By-SA license](https://creativecommons.org/licenses/by-sa/3.0/), and is a [Beerware](http://en.wikipedia.org/wiki/Beerware).

"Fiasco-Mustache" uses the following libraries :

* [https://github.com/janl/mustache.js/](Mustache.js) for the template generation
* [http://getbootstrap.com](Bootstrap) for the css rendering
* [http://jquery.com/](jQuery) for the AJAX functions
* [https://knockoutjs.com/](KnockoutJS) for the UI interaction
* [https://github.com/eligrey/FileSaver.js/](FileSaver.js) for the file saving/loading
* [http://pdfmake.org/#/](PdfMake) for generating the PDF

## Credit

All due credit and inspiration is given to the original author of Fiasco-Mustache, Nicolas Ronvel [(original repo)](https://github.com/Gulix/fiasco-mustache)
