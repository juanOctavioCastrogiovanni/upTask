
export const cambiarColor = (estado,urlId) => {
    // Como existen 2 menus el proceso se debe repetir con cada uno

    // En este caso capturo todos los li para recorrerlos por supuesto
    const li = document.querySelectorAll(`.${urlId}`);

    // Tambien capturo los del en el caso que esten dentro del li
    const del = document.querySelectorAll(`.${urlId} > del`);

    // Si el estado es falso bueno debo sacar lo tachado de ese proyecto tanto del menu sm como el de escritorio
    if(del[0]&&del[1]&&!estado){

        // recorro el mismo proyecto pero uno en el menu de sm y otro en el del escritorio
        for (let i = 0; i < li.length ; i++){
            // Son 2, en ambos borro el tachado
            remueveLoTachado(i,li,del)
        } 
        
    } else if(!del[0]&&!del[1]&&estado){
        // recorro el mismo proyecto pero uno en el menu de sm y otro en el del escritorio
        for (let i = 0; i < li.length ; i++){
            // Son 2, en ambos agrego el tachado
            agregaLoTachado(i,li)
        } 
    }
}

// Esta funcion remueve lo tachado y coloca el titulo en blanco

// El algoritmo detecta el "a" dentro del "del" y lo guarda
// luego borra el del
// y el a guardado lo vuelve a meter en el li
{/* <li>
    <del>
        <a></a>
    </del>
</li> */}



const remueveLoTachado = (pos,li,del) => {
    const a = del[pos].querySelector('a');
    a.style.color='white'
    del[pos].remove()
    li[pos].appendChild(a);
}

// Esta funcion agrega el del porque el proyecto esta completado
const agregaLoTachado = (pos,li) => {
    const a = li[pos].querySelector('a');
    a.style.color='rgb(196,196,196)'
    const c = a;
    a.remove();
    let del = document.createElement("del")
    li[pos].appendChild(del);
    del.appendChild(c);
}