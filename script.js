import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


function render(){
    const storage = localStorage.getItem("patients")
    const patients = storage ? JSON.parse(storage) : []
    const tbody = document.querySelector("tbody"); tbody.innerHTML=""
    patients.forEach(patient => {
        const birthDay = parseInt(patient.birth.slice(8))
        const birthYear = parseInt(patient.birth.slice(0,4))
        const birthMonth = parseInt(patient.birth.slice(5,7))

        const date = new Date()
        const currentDay = parseInt(date.getDate())
        const currentMonth = parseInt(date.getMonth())
        const currentYear = parseInt(date.getFullYear())

        let age = (currentYear-birthYear)
        if((currentMonth>birthMonth)){
            age-=1
        }



        const tr = document.createElement("tr")
        tr.setAttribute("title",patient.birth)
        tr.innerHTML = `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.cpf}</td>
                <td>${patient.wpp}</td>
                <td>${age}</td>
                <td>Não Atendido</td>
                <td>
                    <button id="C${patient.id}">Consultar</button>
                    <button id="E${patient.id}">Editar</button>
                    <button id="D${patient.id}">Deletar</button>
                </td>
            </tr>
        `
        tbody.appendChild(tr)
        document.querySelector(`#D${patient.id}`).addEventListener("click",()=>{
            deletePatient(patient.id)
            render()
        })
        document.querySelector(`#E${patient.id}`).addEventListener("click",()=>{
            const edit = document.getElementById("edit")
            edit.style.display="flex"
            document.querySelector("#eName").value=patient.name
            document.querySelector("#eCpf").value=patient.cpf
            document.querySelector("#eWpp").value=patient.wpp
            document.querySelector("#eBirth").value=patient.birth
        })
    })
}
function newPatient(name,cpf,wpp,birth){
    const newPatient = {
        id:uuidv4(),
        name: name.value,
        cpf: cpf.value,
        wpp: wpp.value,
        birth: birth.value
    }
    const storage = localStorage.getItem("patients")
    const patients = storage ? JSON.parse(storage) : []
    localStorage.setItem("patients", JSON.stringify([...patients,newPatient]))

    name.value=cpf.value=wpp.value=birth.value=""
}
function editPatient(id){

}
function deletePatient(id){
    const patients = JSON.parse(localStorage.getItem("patients"))
    const newPatient = patients.filter((patient)=>{
        return patient.id != id
    })
    localStorage.setItem("patients",JSON.stringify(newPatient))
}
function consultPatient(){

}
document.addEventListener('DOMContentLoaded',render)
document.querySelector("#new").addEventListener("click",()=>{
    const patient = document.getElementById("patient")
    patient.style.display="flex"
})
document.querySelector("#patient form").addEventListener("submit",(event)=>{
    event.preventDefault()
    newPatient(
        document.querySelector("#name"),
        document.querySelector("#cpf"),
        document.querySelector("#wpp"),
        document.querySelector("#birth"),
    )
    render()
})
document.querySelector("#patient form div:last-child button:last-child").addEventListener("click",()=>{
    patient.style.display="none"
})
document.querySelector("#edit form div:last-child button:last-child").addEventListener("click",()=>{
    edit.style.display="none"
})

let cpf = document.querySelector("#cpf")
cpf.addEventListener("keypress",()=>{
    let length = cpf.value.length
    if(length==3 || length==7){
        cpf.value+="."
    }
    if(cpf.value.length==11){
        cpf.value+="-"
    }
})
let wpp = document.querySelector("#wpp")
wpp.addEventListener("keypress",()=>{
    let length = wpp.value.length
    if(length==0){
        wpp.value+="("
    } else if(length==3){
        wpp.value+=")"
    } else if(length==9){
        wpp.value+="-"
    }
})