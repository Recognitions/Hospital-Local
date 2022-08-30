import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

function message(txt){
    const msg = document.querySelector(".message")
    const text = document.querySelector(".message h1")
    text.innerHTML = txt
    msg.style.display="flex"
    setInterval(()=>{
        msg.style.display="none"
    },3000)
}

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
        tr.innerHTML = `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.cpf}</td>
                <td>${patient.wpp}</td>
                <td>${age}</td>
                <td title="Sintomas: ${patient.covid.num}">${patient.covid.result}</td>
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
            message("Paciente Deletado com Sucesso!")
        })
        document.querySelector(`#E${patient.id}`).addEventListener("click",()=>{
            const edit = document.getElementById("edit")
            edit.style.display="flex"
            document.querySelector("#edit form").id=patient.id
            document.querySelector("#eName").value=patient.name
            document.querySelector("#eCpf").value=patient.cpf
            document.querySelector("#eWpp").value=patient.wpp
            document.querySelector("#eBirth").value=patient.birth
        })
        document.querySelector(`#C${patient.id}`).addEventListener("click",()=>{
            const consult = document.getElementById("consult")
            consult.style.display="flex"
            document.querySelector("#consult form").dataset.id=patient.id
            document.querySelector("#consult form").dataset.name=patient.name
            document.querySelector("#consult form").dataset.cpf=patient.cpf
            document.querySelector("#consult form").dataset.wpp=patient.wpp
            document.querySelector("#consult form").dataset.birth=patient.birth
            
        })
    })
}
function newPatient(newP){
    const newPatient = {
        id:uuidv4(),
        name: newP.name,
        cpf: newP.cpf,
        wpp: newP.wpp,
        birth: newP.birth,
        covid:{
            symp:[],
            num:0,
            result:"Não Atendido"
        }
    }
    const storage = localStorage.getItem("patients")
    const patients = storage ? JSON.parse(storage) : []
    localStorage.setItem("patients", JSON.stringify([...patients,newPatient]))

    document.querySelector("#name").value=document.querySelector("#cpf").value=document.querySelector("#wpp").value=document.querySelector("#birth").value=""
}
function editPatient(id,name,cpf,wpp,birth){
    const storage = localStorage.getItem("patients")
    const patients = storage ? JSON.parse(storage) : []
    const uPatient = {
        id:id.id,
        name:name.value,
        cpf:cpf.value,
        wpp:wpp.value,
        birth:birth.value,
        covid:{
            symp:[],
            num:0,
            result:"Não Atendido"
        }
    }
    localStorage.setItem("patients", JSON.stringify([...patients,uPatient]))
    document.getElementById("edit").style.display="none"
}
function deletePatient(id){
    const patients = JSON.parse(localStorage.getItem("patients"))
    const newPatient = patients.filter((patient)=>{
        return patient.id != id
    })
    localStorage.setItem("patients",JSON.stringify(newPatient))
}
function consultPatient(cons){
    const storage = localStorage.getItem("patients")
    const patients = storage ? JSON.parse(storage) : []
    const cPatient = {
        id: cons.id,
        name: cons.name,
        cpf: cons.cpf,
        wpp: cons.wpp,
        birth: cons.birth,
        covid: cons.covid
    }
    localStorage.setItem("patients", JSON.stringify([...patients,cPatient]))
    document.getElementById("consult").style.display="none"
}
document.addEventListener('DOMContentLoaded',render)
document.querySelector("#new").addEventListener("click",()=>{
    const patient = document.getElementById("patient")
    patient.style.display="flex"
})
function CPF(cpf){
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    let add = 0;
    for (let i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    add = 0;
    for (let i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}
document.querySelector("#patient form").addEventListener("submit",(event)=>{
    event.preventDefault()
    const newP = {
        name: document.querySelector("#name").value,
        cpf: document.querySelector("#cpf").value,
        wpp: document.querySelector("#wpp").value,
        birth: document.querySelector("#birth").value,
    }
    if(CPF(newP.cpf)==true){
        newPatient(newP)
        render()
        message("Paciente Cadastrado com Sucesso!")
    }else{
        alert("CPF Inválido!")
    }
})

document.querySelector("#edit form").addEventListener("submit",(event)=>{
    event.preventDefault()
    if(CPF(document.querySelector("#eCpf").value)==true){
        deletePatient(document.querySelector("#edit form").id)
        editPatient(
            document.querySelector("#edit form"),
            document.querySelector("#eName"),
            document.querySelector("#eCpf"),
            document.querySelector("#eWpp"),
            document.querySelector("#eBirth"),
        )
        render()
        message("Paciente Editado com Sucesso!")
    }else{
        alert("CPF Inválido!")
    }
    
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
    if(length>=13){
        console.log("oi")
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
let eCpf = document.querySelector("#eCpf")
eCpf.addEventListener("keypress",()=>{
    let length = eCpf.value.length
    if(length==3 || length==7){
        eCpf.value+="."
    }
    if(eCpf.value.length==11){
        eCpf.value+="-"
    }
})
let eWpp = document.querySelector("#eWpp")
eWpp.addEventListener("keypress",()=>{
    let length = eWpp.value.length
    if(length==0){
        eWpp.value+="("
    } else if(length==3){
        eWpp.value+=")"
    } else if(length==9){
        eWpp.value+="-"
    }
})

const sympList = [
    "Febre",
    "Coriza",
    "Nariz entupido",
    "Cansaço",
    "Tosse",
    "Dor de cabeça",
    "Dores no corpo",
    "Mal estar geral",
    "Dor de garganta",
    "Dificuldade de respirar",
    "Falta de paladar",
    "Falta de olfato",
    "Dificuldade de locomoção",
    "Diarréia"
]
let sympQt = 0
let patientSymp = []
let r = "Não Atendido"
let consultDiv = document.querySelector(".consultDiv")
sympList.forEach((symp)=>{
    const div = document.createElement("div")
    let checkBoxId = uuidv4()
    div.innerHTML=`
        <label for="">${symp}</label>
        <input type="checkbox" id="S${checkBoxId}" value="1">
    `
    consultDiv.appendChild(div)
    const checkbox = document.querySelector(`#S${checkBoxId}`)
    checkbox.addEventListener("click",()=>{
        if(checkbox.checked==true){
            sympQt+=1
            patientSymp.push(symp)
        }else{
            sympQt-=1
            patientSymp.splice(patientSymp.indexOf(symp),1)
        }
        
        if(sympQt>=9){
            r = "<label style='color:red'>Possível Infectado</label>"
        }else if(sympQt>=6 && sympQt<9){
            r = "<label style='color:yellow'>Potencial Infectado</label>"
        }else if(sympQt<6){
            r = "<label style='color:#00ff15'>Sintomas Insuficientes</label>"
        }else if(sympQt==0){
            r = "Não Atendido"
        }
        document.querySelector(".sympArea").innerHTML=`
            <label>Sintomas: ${sympQt}</label>
            <label>Resultado: ${r}</label>
        `

    })
})

document.querySelector("#consult form").addEventListener("submit",(event)=>{
    event.preventDefault()
    const cons = {
        id: document.querySelector("#consult form").dataset.id,
        name: document.querySelector("#consult form").dataset.name,
        cpf: document.querySelector("#consult form").dataset.cpf,
        wpp: document.querySelector("#consult form").dataset.wpp,
        birth: document.querySelector("#consult form").dataset.birth,
        covid:{
            symp:patientSymp,
            num:sympQt,
            result:r
        }
    }
    if(sympQt>0){
        deletePatient(cons.id)
        consultPatient(cons)
        render()
        message("Paciente Consultado com Sucesso!")
    }else{
        alert("Nenhum sintoma apresentado!")
    }
})

document.querySelector("#patient button[type=reset]").addEventListener("click",()=>{
    patient.style.display="none"
})
document.querySelector("#edit button[type=reset]").addEventListener("click",()=>{
    edit.style.display="none"
})
document.querySelector("#consult button[type=reset]").addEventListener("click",()=>{
    consult.style.display="none"
    sympQt=0
    patientSymp=[]
    document.querySelector(".sympArea").innerHTML=""
})