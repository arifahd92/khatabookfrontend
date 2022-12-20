import React, { useState } from "react";
import swal from "sweetalert";
import "./App.css"
import { useEffect } from "react";
const Khatabook = () => {
  let [addcustomer, setaddcustomer]=useState(false)
  let [val, setval] = useState("");
  let [amountval, setamountval] = useState();
  let [phoneno,setphone]=useState("")
  let [gmail, setgmail]=useState("")
  let [type,settype]=useState("debit")
  let [lastdate,setlastdate]=useState("")
  let [updatemode,setupdatemode]=useState(false)
  let [search, setsearch]=useState("")
  let [iid,setiid]=useState(null)
  let [bkddata,setbkddata]=useState({})
  // eslint-disable-next-line
  console.log(lastdate)
    useEffect(()=>{
      sendReminder()
      mycustomer()
    },[])

    // reminder
     async function sendReminder(){
       fetch("https://khatabookbackend.onrender.com/remind")

    }

    async function mycustomer(){
      const res = await fetch("https://khatabookbackend.onrender.com/getcustomer")
      const data = await res.json()
      console.log("i m backend data",data)
      setbkddata(data)
    }

    async function savedata() {
  if(val && amountval && lastdate && phoneno){
   
      const res = await fetch("https://khatabookbackend.onrender.com/savedata",{
          
        method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
          val,amountval,phoneno,gmail,type,lastdate
          
          })
        
        })
  let data= await res.json()//res.json wala ayrga
  console.log("im data",data)
  // console.log(data.message)
  if(data[0].phone===phoneno){
    swal(`${data[0].name} with this number already exists`)
  }
  else if(data[0].name===val){
    swal("customer with this name  already exists")
  }
  else{

    setbkddata(data)
     console.log("first")
     setval("");
     setamountval("")
     setphone("")
     setlastdate(null)
     setaddcustomer(false)
     setgmail("")
  }
  }
  else{

    swal("ensure name, amount, phone and pay date  fields are filled")
  }
  return;
}
  function deletedata(ind) {
  // let cnf = window.confirm("are you sure")
swal("Are you sure? this user's record will be deleted permanently", {  dangerMode: true,  buttons: true,}).then((e)=>{
  console.log(`ime ${e}`)
  if(e===true){

    deleteitem(ind)
  }
})
async function deleteitem(ind){


const res = await fetch("https://khatabookbackend.onrender.com/delete",{
      
  method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
    ind
    
    })
  
  })
  let data=await res.json()//res.json wala ayrga
  console.log(data)
   setsearch("")
   setbkddata(data)
   mycustomer()



}

  }

async function updatedatabcknd(){
  console.log("i got called")
  console.log(amountval)
  const res = await fetch("https://khatabookbackend.onrender.com/updatedatabcknd",{
          
    method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
      iid,val,amountval,phoneno,gmail,type,lastdate
    
      })
    
    })
    const data = await res.json()
    setbkddata(data)
    setupdatemode(false)
     setphone("")
    setamountval("")
    setval("")
    setlastdate("")
    setaddcustomer(false)
    settype("debit")
    mycustomer()
    setgmail("")
 }
 //
 async function updatefrontend(_id,name,phone,gmail1,paydate){
  console.log("val of gmail1",gmail1)
  console.log("i m value of",phone)
  setgmail(gmail1)
  setupdatemode(true)
   setval(name)
   setamountval(0)
   setiid(_id)
   setphone(phone)
   setlastdate(paydate)
   settype("debit")
   setaddcustomer(true)
 }

 //call***********
 function call (id,phone){
  let PhoneNumber=phone
  window.location.href = 'tel://' + PhoneNumber;
 }



 function searchcustomer(e){
  // setsearch(e.target.value)
 let searcheddata= bkddata.filter((elm)=>{
  // let result = (elm.name).includes(search)
   return (elm.name).includes(search)
  })
  setsearch(e.target.value)
  setbkddata(searcheddata)
  if(searcheddata.length===0){
    swal("no customer found")
    window.location.reload(false)
  }
  else if(search.length==1){
    mycustomer()
  }
  console.log("im filterder",searcheddata)
  console.log("i m bkd data",bkddata)
  console.log(search.length)
 }

  return (
    <div>
      <div className="flexcontainer">
       <h1 className="head" >I'm your khatabook</h1>
      </div>
 
   { addcustomer?(

     <>
      <div className="flexcontainer">
      <input
      className="todoinpt" id="customer"
        type="text"
        placeholder="Enter Name*"
        value={val}
        onChange={(e) => setval(e.target.value)}
      />
      <pre> </pre>
      
        <input
      className="todoinpt" id="amount"
        type="number"
        min={0}
        placeholder="Enter Amount*"
        value={amountval}
        onChange={(e) => setamountval(e.target.value)}
      /> 
          </div>
          <div className="flexcontainer">

        <select onChange={(e)=>settype(e.target.value)} name="type" id="select">
        <option value="debit">Debit</option>
       <option value="credit">Credit</option>
       </select>
          </div>
         

     <div className="flexcontainer">
      <input
      className="todoinpt" id="phone"
      type="phone"    
      placeholder="Enter Phone*"
      value={phoneno}
      onChange={(e) => setphone(e.target.value)}
    />
    <pre> </pre>
    <input type="email" id="gmail" className="todoinpt"  placeholder="Enter Gmail" value={gmail}
     onChange={(e)=>setgmail(e.target.value)} /> <pre> </pre>
   </div>
   
   <div className="flexcontainer">
    <span className="paylabel">Select Pay date</span>
   </div>
   <div className="flexcontainer">
  
  <input value={lastdate} className="todoinpt" type="date" name="" id="date" onChange={(e)=>setlastdate(e.target.value)} />
   </div>
     
   <div className="flexcontainer">

       { updatemode?
        
        <button id="tick" className="btn" onClick={updatedatabcknd}>✅</button>
          
         : <button  className="btn" id="plus" onClick={savedata}>➕</button>
      
       }
     </div>
     </>
     )
       :(
     <>
     <div className="flexcontainer">

     <input type="text" name="" id="search" placeholder="Type name of customer" value={search}
      onChange={(e)=>searchcustomer(e)}/>
     </div>
     <div className="flexcontainer+">
      <div className="icon">
     <button id="addbtn" onClick={()=>setaddcustomer(true)}>➕</button>
      </div>
     </div>
     {
       
          (bkddata.length>0)?  bkddata.map((elm, indx) => {
           return (
             <>
          
             <div className="flexcontainer">
             < p key={elm._id} >
               {elm.name}</p> 
               <p>{(elm.amount)}</p>
               <div className="flexcontainerbtn">
               <button  className="edtpls" onClick={()=>updatefrontend(elm._id,elm.name,elm.phone,elm.gmail,elm.paydate,elm.paytype)}>🖊️</button>
               <button  className="dlt" onClick={() => deletedata(elm._id)}>⛔</button>
                <button  className="call" onClick={()=>call(elm._id,elm.phone)}>📱</button>
                 </div>
            </div>
   
            <div className="flexcontainerdate">    
            <span className="showdate">{(elm.date).slice(0,10)}</span> 
           <span className="showdate"> pay date: {(elm.paydate).slice(0,10)}</span>
            </div>
            </>
           );
          }):""
          

     }
     </>
      )
    
    
    }
     
    </div>
  
  );
};
export default Khatabook;
