document.addEventListener('DOMContentLoaded', function() {
    function closest (element, selector) {
      if (Element.prototype.closest) {
        return element.closest(selector);
      }
      do {
        if (Element.prototype.matches && element.matches(selector)
          || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
          || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
          return element;
        }
        element = element.parentElement || element.parentNode;
      } while (element !== null && element.nodeType === 1);
      return null;
    }
  
    // social share popups
    Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(this.href, '', 'height = 500, width = 500');
      });
    });
  
    // In some cases we should preserve focus after page reload
    function saveFocus() {
      var activeElementId = document.activeElement.getAttribute("id");
      sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
    }
    var returnFocusTo = sessionStorage.getItem('returnFocusTo');
    if (returnFocusTo) {
      sessionStorage.removeItem('returnFocusTo');
      var returnFocusToEl = document.querySelector(returnFocusTo);
      returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }
  
    // show form controls when the textarea receives focus or backbutton is used and value exists
    var commentContainerTextarea = document.querySelector('.comment-container textarea'),
      commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');
  
    if (commentContainerTextarea) {
      commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
        commentContainerFormControls.style.display = 'block';
        commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
      });
  
      if (commentContainerTextarea.value !== '') {
        commentContainerFormControls.style.display = 'block';
      }
    }
  
    // Expand Request comment form when Add to conversation is clicked
    var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
      requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
      requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');
  
    if (showRequestCommentContainerTrigger) {
      showRequestCommentContainerTrigger.addEventListener('click', function() {
        showRequestCommentContainerTrigger.style.display = 'none';
        Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
        requestCommentSubmit.style.display = 'inline-block';
  
        if (commentContainerTextarea) {
          commentContainerTextarea.focus();
        }
      });
    }
  
    // Mark as solved button
    var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
      requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
      requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');
  
    if (requestMarkAsSolvedButton) {
      requestMarkAsSolvedButton.addEventListener('click', function () {
        requestMarkAsSolvedCheckbox.setAttribute('checked', true);
        requestCommentSubmitButton.disabled = true;
        this.setAttribute('data-disabled', true);
        // Element.closest is not supported in IE11
        closest(this, 'form').submit();
      });
    }
  
    // Change Mark as solved text according to whether comment is filled
    var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');
  
    if (requestCommentTextarea) {
      requestCommentTextarea.addEventListener('input', function() {
        if (requestCommentTextarea.value === '') {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
          }
          requestCommentSubmitButton.disabled = true;
        } else {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
          }
          requestCommentSubmitButton.disabled = false;
        }
      });
    }
  
    // Disable submit button if textarea is empty
    if (requestCommentTextarea && requestCommentTextarea.value === '') {
      requestCommentSubmitButton.disabled = true;
    }
  
    // Submit requests filter form on status or organization change in the request list page
    Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
      el.addEventListener('change', function(e) {
        e.stopPropagation();
        saveFocus();
        closest(this, 'form').submit();
      });
    });
  
    // Submit requests filter form on search in the request list page
    var quickSearch = document.querySelector('#quick-search');
    quickSearch && quickSearch.addEventListener('keyup', function(e) {
      if (e.keyCode === 13) { // Enter key
        e.stopPropagation();
        saveFocus();
        closest(this, 'form').submit();
      }
    });
  
    function toggleNavigation(toggle, menu) {
      var isExpanded = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', !isExpanded);
      toggle.setAttribute('aria-expanded', !isExpanded);
    }
  
    function closeNavigation(toggle, menu) {
      menu.setAttribute('aria-expanded', false);
      toggle.setAttribute('aria-expanded', false);
      toggle.focus();
    }
  
    var burgerMenu = document.querySelector('.header .menu-button');
    var userMenu = document.querySelector('#user-nav');
  
    burgerMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleNavigation(this, userMenu);
    });
  
  
    userMenu.addEventListener('keyup', function(e) {
      if (e.keyCode === 27) { // Escape key
        e.stopPropagation();
        closeNavigation(burgerMenu, this);
      }
    });
  
    if (userMenu.children.length === 0) {
      burgerMenu.style.display = 'none';
    }
  
    // Toggles expanded aria to collapsible elements
    var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');
  
    Array.prototype.forEach.call(collapsible, function(el) {
      var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');
  
      el.addEventListener('click', function(e) {
        toggleNavigation(toggle, this);
      });
  
      el.addEventListener('keyup', function(e) {
        if (e.keyCode === 27) { // Escape key
          closeNavigation(toggle, this);
        }
      });
    });
  
    // Submit organization form in the request page
    var requestOrganisationSelect = document.querySelector('#request-organization select');
  
    if (requestOrganisationSelect) {
      requestOrganisationSelect.addEventListener('change', function() {
        closest(this, 'form').submit();
      });
    }
  
    // If a section has more than 6 subsections, we collapse the list, and show a trigger to display them all
    const seeAllTrigger = document.querySelector("#see-all-sections-trigger");
    const subsectionsList = document.querySelector(".section-list");
  
    if (subsectionsList && subsectionsList.children.length > 6) {
      seeAllTrigger.setAttribute("aria-hidden", false);
  
      seeAllTrigger.addEventListener("click", function(e) {
        subsectionsList.classList.remove("section-list--collapsed");
        seeAllTrigger.parentNode.removeChild(seeAllTrigger);
      });
    }
  
    // If multibrand search has more than 5 help centers or categories collapse the list
    const multibrandFilterLists = document.querySelectorAll(".multibrand-filter-list");
    Array.prototype.forEach.call(multibrandFilterLists, function(filter) {
      if (filter.children.length > 6) {
        // Display the show more button
        var trigger = filter.querySelector(".see-all-filters");
        trigger.setAttribute("aria-hidden", false);
  
        // Add event handler for click
        trigger.addEventListener("click", function(e) {
          e.stopPropagation();
          trigger.parentNode.removeChild(trigger);
          filter.classList.remove("multibrand-filter-list--collapsed")
        })
      }
    });
  
    // If there are any error notifications below an input field, focus that field
    const notificationElm = document.querySelector(".notification-error");
    if (
      notificationElm &&
      notificationElm.previousElementSibling &&
      typeof notificationElm.previousElementSibling.focus === "function"
    ) {
      notificationElm.previousElementSibling.focus();
    }
  
  /* JESUS */
    
  ///// CAPTURAMOS LA ORGANIZACION DEL USUARIO UNA VEZ LOGUEADO  ///////////
    let form_erp = [];
    let form_cloud = [];
    
       //Recorre el arreglo para ocultarlo predeterminadamente en el combo
       function Ocultar_Option(form_erp, form_cloud){
         form_erp.forEach(function(datos, index) {
            $('#'+datos).hide();  
          }); 
  
          form_cloud.forEach(function(datos, index) {
            $('#'+datos).hide();  
          });    
       }
    
   // BUCLE PARA REVISIÓN DE CADA ORGANIZACIÓN
        //Condicionalidad para filtrar formularios
        function Mostrar_Option(form_erp, form_cloud){
          let erp = 0;
          let cloud = 0;
          for (key of HelpCenter.user.organizations) {
            console.log("tag")
            console.log(key)
          }
          for (tag in element) {
            console.log(tag)
            if (tag === 'erp_si') {
              erp += 1;
            }
            else if (tag === 'cloud_si') {
              cloud += 1;
            }
          }
        if (erp > 0) {
           form_erp.forEach(function(datos, index) {
                 $('#'+datos).show();
           });
        }
        else if (cloud > 0) {
           form_cloud.forEach(function(datos, index) {
                 $('#'+datos).show();
           });
        }
        else if (erp > 0 && cloud > 0){
          form_erp.forEach(function(datos, index) {
                 $('#'+datos).show();
           });
          form_cloud.forEach(function(datos, index) {
                 $('#'+datos).show();
           });
        }
        else if (erp == 0 && cloud == 0){
          form_erp.forEach(function(datos, index) {
          $('#'+datos).hide();  
        }); 
  
        form_cloud.forEach(function(datos, index) {
          $('#'+datos).hide();  
        });
        }
      }
   // }

  $("#request_issue_type_select option").each(function(){
      //$($(this).val()).hide();
  //  console.log($(this).val());
  });
     //Se llena los arreglos con los Id's de los formularios que se va a mostrar
     function Analisis(tags) {
       if ($.inArray(tags,'erp_si')){ 		     
           //Solicitar asistencia a Enlaza = 360000110697
           //Enviar una Queja, Reclamo o Sugerencia = 360000110797
           //Solicitar un Servicio de Consultoría = 360000122718        
           //Sugerir una mejora de Producto = 360000122738
           //Solicitar una cotización de Desarrollo a la Medida = 360000122758
          form_erp = ['360000110697','360000110797','360000122718','360000122738','360000122758'];
        }
            if ($.inArray(tags,'cloud_si')){
           //Solicitar asistencia a Enlaza = 360000110697
           //Enviar una Queja, Reclamo o Sugerencia = 360000110797
           //Solicitar un Servicio de Consultoría = 360000122718        
           //Sugerir una mejora de Producto = 360000122738
           //Solicitar una cotización de Desarrollo a la Medida = 360000122758
           //Reportar un problema con la plataforma Cloud (rendimiento, acceso, estabilidad) = 360000122798 
           //Solicitar un servicio cloud(interno) = 360000122818
          form_cloud = ['360000110697','360000110797','360000122718','360000122738','360000122758','360000122798','360000122818'];
        }
       Ocultar_Option(form_erp,form_cloud); 
       Mostrar_Option(form_erp,form_cloud);
  }                 
  
     var i = 0;
     var cZendesk = false; //assume user is not part of the Zendesk Organization
     
    //reserve space for additional organizations
     var checkExist = setInterval(function() {
        i++;
        if ($("a.nesty-input").length){
           clearInterval(checkExist);
          $("a.nesty-input").each(function() {
  
            $(this).bind( "click", function() {
              $('#360000110697').hide();
  
         // console.log($(this).lenght);
  
              //console.log(HelpCenter.user);
              /*
              for (var c in HelpCenter.user.organizations) {
                console.dir(c)
                if (c == 0){
                  Analisis(HelpCenter.user.organizations[c].name);
                }
              }
              */
              console.log(HelpCenter.user);
             //Analisis(HelpCenter.user.organizations);
              });
           });
        }
        if (i > 20){
           clearInterval(checkExist);
        }
     }, 100); 
    
    // habilitar el widget del chat
    window.zESettings = {
      webWidget: {
        chat: {
          suppress: true
        },
        contactForm: {
          suppress: true
        }
      }
    };
  });
  /* FIN JESUS */



//Solicitar asistencia a Enlaza = 360000110697
//Enviar una Queja, Reclamo o Sugerencia = 360000110797
//Solicitar un Servicio de Consultoría = 360000122718        
//Sugerir una mejora de Producto = 360000122738
//Solicitar una cotización de Desarrollo a la Medida = 360000122758
//Reportar un problema con la plataforma Cloud (rendimiento, acceso, estabilidad) = 360000122798 
//Solicitar un servicio cloud(interno) = 360000122818


//Enviar una Queja, Reclamo o Sugerencia = 360000110797
//Solicitar un Servicio de Consultoría = 360000122718        
//Sugerir una mejora de Producto = 360000122738
//Solicitar una cotización de Desarrollo a la Medida = 360000122758

document.addEventListener('DOMContentLoaded', function() {
  function closest (element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (Element.prototype.matches && element.matches(selector)
        || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
        || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // In some cases we should preserve focus after page reload
  function saveFocus() {
    var activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
  }
  var returnFocusTo = sessionStorage.getItem('returnFocusTo');
  if (returnFocusTo) {
    sessionStorage.removeItem('returnFocusTo');
    var returnFocusToEl = document.querySelector(returnFocusTo);
    returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
  }

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector('.comment-container textarea'),
    commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
      commentContainerFormControls.style.display = 'block';
      commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
    });

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block';
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
    requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
    requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function () {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function() {
      if (requestCommentTextarea.value === '') {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
        }
        requestCommentSubmitButton.disabled = false;
      }
    });
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && requestCommentTextarea.value === '') {
    requestCommentSubmitButton.disabled = true;
  }

  // Submit requests filter form on status or organization change in the request list page
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    });
  });

  // Submit requests filter form on search in the request list page
  var quickSearch = document.querySelector('#quick-search');
  quickSearch && quickSearch.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { // Enter key
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    }
  });

  function toggleNavigation(toggle, menu) {
    var isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
    toggle.setAttribute('aria-expanded', !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute('aria-expanded', false);
    toggle.setAttribute('aria-expanded', false);
    toggle.focus();
  }

  var burgerMenu = document.querySelector('.header .menu-button');
  var userMenu = document.querySelector('#user-nav');

  burgerMenu.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleNavigation(this, userMenu);
  });


  userMenu.addEventListener('keyup', function(e) {
    if (e.keyCode === 27) { // Escape key
      e.stopPropagation();
      closeNavigation(burgerMenu, this);
    }
  });

  if (userMenu.children.length === 0) {
    burgerMenu.style.display = 'none';
  }

  // Toggles expanded aria to collapsible elements
  var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');

  Array.prototype.forEach.call(collapsible, function(el) {
    var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');

    el.addEventListener('click', function(e) {
      toggleNavigation(toggle, this);
    });

    el.addEventListener('keyup', function(e) {
      if (e.keyCode === 27) { // Escape key
        closeNavigation(toggle, this);
      }
    });
  });

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  // If a section has more than 6 subsections, we collapse the list, and show a trigger to display them all
  const seeAllTrigger = document.querySelector("#see-all-sections-trigger");
  const subsectionsList = document.querySelector(".section-list");

  if (subsectionsList && subsectionsList.children.length > 6) {
    seeAllTrigger.setAttribute("aria-hidden", false);

    seeAllTrigger.addEventListener("click", function(e) {
      subsectionsList.classList.remove("section-list--collapsed");
      seeAllTrigger.parentNode.removeChild(seeAllTrigger);
    });
  }

  // If multibrand search has more than 5 help centers or categories collapse the list
  const multibrandFilterLists = document.querySelectorAll(".multibrand-filter-list");
  Array.prototype.forEach.call(multibrandFilterLists, function(filter) {
    if (filter.children.length > 6) {
      // Display the show more button
      var trigger = filter.querySelector(".see-all-filters");
      trigger.setAttribute("aria-hidden", false);

      // Add event handler for click
      trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        trigger.parentNode.removeChild(trigger);
        filter.classList.remove("multibrand-filter-list--collapsed")
      })
    }
  });

  // If there are any error notifications below an input field, focus that field
  const notificationElm = document.querySelector(".notification-error");
  if (
    notificationElm &&
    notificationElm.previousElementSibling &&
    typeof notificationElm.previousElementSibling.focus === "function"
  ) {
    notificationElm.previousElementSibling.focus();
  }

  /* --------------
        ZERVIZ 
     -------------- */

  // this variable() emulate an user id from url
  let user_id = "https:123.123.2.4/reuest/user/33333333";
  let split_user_id = user_id.split("/");
  let id = split_user_id[split_user_id.length - 1];

// forms
//Solicitar asistencia a Enlaza = 360000110697
//Enviar una Queja, Reclamo o Sugerencia = 360000110797
//Solicitar un Servicio de Consultoría = 360000122718        
//Sugerir una mejora de Producto = 360000122738
//Solicitar una cotización de Desarrollo a la Medida = 360000122758
//Reportar un problema con la plataforma Cloud (rendimiento, acceso, estabilidad) = 360000122798 
//Solicitar un servicio cloud(interno) = 360000122818

  let erp_forms = [
    '360000110697',
    '360000110797',
    '360000122718',
    '360000122738',
    '360000122758',
  ];
  let cloud_forms = [
    '360000110697',
    '360000110797',
    '360000122718',
    '360000122738',
    '360000122758',
    '360000122798',
    '360000122818',
  ];
	
  // function that hide all forms
  let hideForms = function(form_erp, form_cloud) {
    form_erp.forEach(function(currentValue) {
      $('#'+currentValue).hide();
    });
    form_cloud.forEach(function(currentValue) {
      $('#'+currentValue).hide();
    });
  }
  
  // function that show all forms associates to user_id
  let showForms = function() {
    for (let organization of HelpCenter.user.organizations) {
      let tags = organization.tags;
      let tag_id = tags.filter((tag) => tag.startsWith("id_"));
			// cloud_si && erp_si
      if (tag_id[0].split("_")[tag_id.length] == id) {
        if (tags.includes('cloud_si') && tags.includes('erp_si')) {
          cloud_forms.forEach(function(datos, index) {
            $('#'+datos).show();
           });
          erp_forms.forEach(function(datos, index) {
            $('#'+datos).show();
          });
        }
      }
      // cloud_si
      if (tags.includes('cloud_si') && !tags.includes('erp_si')) {
        cloud_forms.forEach(function(datos, index) {
          $('#'+datos).show();
         });
      }
      // erp_si
      if (!tags.includes('cloud_si') && tags.includes('erp_si')) {
        erp_forms.forEach(function(datos, index) {
          $('#'+datos).show();
        });
      }
      // not (erp_si, cloud_si)
      else {
        hideForms(erp_forms, cloud_forms);
      }
    };
  }
  // hideForms(erp_forms, cloud_forms);
  // showForms();
  
//reserve space for additional organizations
// var i = 0


  
  
  /* ----------------------- */
  
  // enable chat widget
  window.zESettings = {
    webWidget: {
      chat: {
        suppress: true
      },
      contactForm: {
        suppress: true
      }
    }
  };
});