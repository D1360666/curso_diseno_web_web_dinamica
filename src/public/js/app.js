const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment();

const getAll = async () => {
    try{
        let res = await fetch("http://localhost:9000/api/users"),
        json = await res.json()
       
        if(!res.ok) throw {status: res.status, statusText: res.statusText}
        
        json.forEach(el => {
            console.log(el);     
            $template.querySelector(".name").textContent = el.name;
            $template.querySelector(".age").textContent=el.age;
            $template.querySelector(".email").textContent=el.email;
            $template.querySelector(".edit").dataset.id = el._id;
            $template.querySelector(".edit").dataset.name = el.name;
            $template.querySelector(".edit").dataset.age = el.age;
            $template.querySelector(".edit").dataset.email = el.email;
            $template.querySelector(".delete").dataset.id=el._id            

            let $clone = d.importNode($template, true)
            $fragment.appendChild($clone);
        })
        $table.querySelector("tbody").appendChild($fragment)

    }catch(err){
        let message = err||"Ocurrió un error"
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
    }
}
d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async e => {
    if(e.target===$form){
        e.preventDefault();
 
        if(!e.target.id.value){
            //CREATE - POST
            try{
                let options = {
                    method:"POST",
                    headers: {
                        "Content-type":"application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        name: e.target.name.value,
                        age: e.target.age.value,
                        email: e.target.email.value
                    })
                },
                res= await fetch("http://localhost:9000/api/users", options),
                json = await res.json()

                if(!res.ok)throw {status: res.status, statusText: res.statusText}
                location.reload()

            }catch(err){
                let message = err.statusText || "Ocurrió un error"
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
            }
        }else{
            //UPDATE - PUT
            
            try{

                let options = {
                    method:"PUT",
                    headers: {
                        "Content-type":"application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        name: e.target.name.value,
                        age: e.target.age.value,
                        email: e.target.email.value
                    })
                },
                res= await fetch(`http://localhost:9000/api/users/${e.target.id.value}`, options),
                json = await res.json();

                if(!res.ok)throw {status: res.status, statusText: res.statusText}
                location.reload();
            }catch(err){
                let message = err.statusText || "Ocurrió un error"
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
            }
        }
    }
})
d.addEventListener("click", async e=> {
    if(e.target.matches(".edit")){
        $title.textContent= "Editar Usuario";
        $form.name.value = e.target.dataset.name;
        $form.age.value = e.target.dataset.age;
        $form.email.value = e.target.dataset.email;
        $form.id.value = e.target.dataset.id
    }
    if(e.target.matches(".delete")){

        let isDelete = confirm(`¿EStás seguro de eliminar el id ${e.target.dataset.id}?`);
        //Delete - DELETE
        if(isDelete){
            try{
                let options = {
                    method:"DELETE",
                    headers: {
                        "Content-type":"application/json; charset=utf-8"
                    }
                },
                res= await fetch(`http://localhost:9000/api/users/${e.target.dataset.id}`, options),
                json = await res.json();

                if(!res.ok)throw {status: res.status, statusText: res.statusText}
                location.reload();
            }catch(err){
                let message = err.statusText || "Ocurrió un error"
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
            }
        }
    }
})