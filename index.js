const $table = document.querySelector(".crud-table");
const $form = document.querySelector(".crud-form");
const $title = document.querySelector(".crud-title");
const $template = document.querySelector("#crud-template").content;
const $fragment = document.createDocumentFragment();
const $id = document.querySelector(".crud-table")

//Requete -----------------------------------------------------------------

const ajax = (options) => {
  let  {method, url, succes, error, data}= options

  var oReq = new XMLHttpRequest();

  oReq.open( method || "GET", url);
  oReq.setRequestHeader("Content-Type", "application/json;charset=utf-8");

  oReq.send(JSON.stringify(data));

  oReq.addEventListener("load",  (e)=>{
    
    if ((oReq.status >= 200 && oReq.status < 300) &&(oReq.readyState === 4)) {
      let json = JSON.parse(oReq.responseText);
        //console.log(json);
        succes(json)
      } 
      else {
        let message = oReq.statusText ||"Ocurrio un error"
        error(`Ocurrio un error:   ${oReq.statusText}: ${message}`);
          }
  })

  oReq.addEventListener("error", (e)=>{
    alert(`Transfer failed`)
  },false);
}

// GET ----------------------------------------------------------------------

const getAll = () =>{
  ajax({
    
    method: "GET",
    
    url: "http://localhost:3000/articles",
    
    succes : (res)=>{
        res.forEach(el => {
        $template.querySelector('.article').textContent = el.article;
        $template.querySelector('.code').textContent = el.code;
        $template.querySelector('.btn_edit').dataset.id = el.id;
        $template.querySelector('.btn_edit').dataset.article = el.article;
        $template.querySelector('.btn_edit').dataset.code = el.code;
        $template.querySelector('.btn_del').dataset.id = el.id;
        let $clone= document.importNode($template,true);
        $fragment.appendChild($clone)
          
      })
      $table.querySelector('tbody').appendChild($fragment)
    },
  
    error: (err)=>{
      console.log("Transfer failed")
      alert(`Transfer failed`)
    },
    
    data:null 

  })
}

document.querySelector("#iden").value=""
document.addEventListener("DOMContentLoaded", getAll )


// POST et PUT  ---------------------------------------------------------------------
document.addEventListener("submit", e =>{
  if (e.target === $form){
    e.preventDefault();
    if(!e.target.id.value){

      // POST---------------------------------------------------------
      ajax({

        method: "POST",
    
        url: "http://localhost:3000/articles",
    
        data: {
          article: e.target.article.value,
          code: e.target.code.value
          },
    
        succes: (res)=>{location.reload()},
    
         error: (err)=>{
            console.log("Transfer failed")
            alert(`Transfer failed`)
          } 
      })
    }
    else {
    // PUT---------------------------------------------------------
      ajax({

        method: "PUT",
    
        url: `http://localhost:3000/articles/${e.target.id.value}`,
    
        data: {
          article: e.target.article.value,
          code: e.target.code.value
          },
    
          success: (res) => {
            document.getElementById("iden").value = ""
            location.reload()
          },
        error: (err)=>{
            console.log("Transfer failed")
            alert(`Transfer failed`)
          } 
      })
    }
  }  
})


// event button edit

document.addEventListener("click", e =>{
  if(e.target.matches(".btn_edit")){
    e.preventDefault();
    console.log(e.target)
    $title.textContent = 'EDIT ARTICLE'
    $form.article.value = e.target.dataset.article
    $form.code.value = e.target.dataset.code
    $form.id.value = e.target.dataset.id
  }
})

// event button edit
document.addEventListener("click", e =>{
  if(e.target.matches(".btn_del")){
    e.preventDefault()
    console.log(e.target)
    
    isDelete = confirm(`Êtes-vous sûr de supprimer l'identifiant ${e.target.dataset.id}?`)
       
    if (isDelete){
      ajax({
        method: "DELETE",
          
        url:`http://localhost:3000/articles/${e.target.dataset.id}`,
          
        success: (res) => location.reload(),
           
        error: (err)=>{
            console.log("Transfer failed")
            alert(`Transfer failed`)
        } 
                  
      }) 
    }
  }
})

