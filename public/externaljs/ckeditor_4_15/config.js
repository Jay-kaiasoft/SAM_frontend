/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
    config.title = false;
	config.height = 377;
    config.colorButton_enableMore = true;
    config.enterMode = CKEDITOR.ENTER_BR;

    config.autoGrow_onStartup = true;
    config.startupFocus = true;

    config.fontFormats = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';
    config.fontSize_sizes =
        '12/12px;14/14px;16/16px;18/18px;24/24px;32/32px;48/48px;64/64px;Default Size/;' +
        '10/10px;11/11px;12/12px;13/13px;14/14px;15/15px;16/16px;17/17px;18/18px;19/19px;20/20px;21/21px;22/22px;23/23px;24/24px;25/25px;26/26px;27/27px;28/28px;29/29px;30/30px;31/31px;32/32px;33/33px;34/34px;35/35px;36/36px;37/37px;38/38px;39/39px;40/40px;41/41px;42/42px;43/43px;44/44px;45/45px;46/46px;47/47px;48/48px;49/49px;50/50px;51/51px;52/52px;53/53px;54/54px;55/55px;56/56px;57/57px;58/58px;59/59px;60/60px;61/61px;62/62px;63/63px;64/64px;';

    config.extraAllowedContent =
        'a abbr acronym address area article aside b base basefont bdi bdo big blink blockquote ' +
        'br button caption center cite code col colgroup content data datalist dd del details dfn dir div dl dt ' +
        'element em fieldset figcaption figure font footer h1 h2 h3 h4 h5 h6 header hgroup hr i img ins label legend ' +
        'li link listing main map mark marquee menu menuitem meta meter nav nobr ol p pre progress q s samp section small ' +
        'spacer span strike strong style sub summary sup table tbody td textarea tfoot th thead tr tt u ul wbr xmp(*){*}[*]';

    config.removeFormatTags = 'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var,h1,h2,h3,h4,h5,h6';
    config.scayt_autoStartup = false;
	config.extraPlugins = 'mergeudfs,mergesurveys,mergeassessments,mergebutton,mergecustomforms,emoji,mergepropertiestext,mergepropertieslabel,mergepropertiesheader,mergepropertiesfooter,mergetextai,closebtn,mergeaddsignature';

    config.toolbar = 'Full';
    config.toolbar_Full = [
        ['Bold','Italic','Underline','TextColor','BGColor','Font','FontSize','mergePropertiesText','mergePropertiesLabel','mergePropertiesHeader','mergePropertiesFooter','closebtn'],
        '/',
        ['NumberedList','BulletedList','HorizontalRule','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','Table','Link','Unlink','RemoveFormat','EmojiPanel','mergeTextAi'],
        '/',
        ['Mergeudfs','Mergesurveys','Mergeassessments','Mergecustomforms','mergeAddSignature','mergeButton'],
    ];

    config.dialog_backgroundCoverColor = '#000000';
    config.resize_enabled = false;
    config.toolbarCanCollapse = false;
    config.useComputedState = false;
    config.bodyClass = 'neapolitan-ck-body';
    config.font_names =
        'Arial/Arial, Helvetica Neue, Helvetica, sans-serif;' +
        'Brush Script MT/Brush Script MT, cursive;' +
        'Calibri/Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif;' +
        'Comic Sans MS/Comic Sans MS, Marker Felt-Thin, Arial, sans-serif;' +
        'Courier New/Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace;' +
        'Futura/Futura, Trebuchet MS, Arial, sans-serif;' +
        'Garamond/Garamond, Baskerville, Baskerville Old Face, Hoefler Text, Times New Roman, serif;' +
        'Georgia/Georgia, Times, Times New Roman, serif;' +
        'Helvetica/Helvetica, Arial, sans-serif;'+
        'Lucida/Lucida Sans Unicode, Lucida Grande, sans-serif;' +
        'Palatino/Palatino, Palatino Linotype, Palatino LT STD, Book Antiqua, Georgia, serif;' +
        'Tahoma/Tahoma, Verdana, Segoe, sans-serif;' +
        'Times New Roman/Times New Roman, Times, Baskerville, Georgia, serif;' +
        'Trebuchet MS/Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;' +
        'Verdana/Verdana, Geneva, sans-serif;';
        
    /** default config **/
    config.font_defaultLabel = 'Arial';
    config.fontSize_defaultLabel = '16px';
    config.surveystags = [];
    config.assessmentstags = [];
    config.customformstags = [];
    config.tags = [];
    config.edful = 0;
    config.fontSize_style = {
        element: 'span',
        styles: {
            'font-size': '#(size)',
            'line-height': '#(size)'
        }
    };
};