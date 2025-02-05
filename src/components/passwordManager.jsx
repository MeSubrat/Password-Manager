import React, { useEffect, useState } from 'react'
import './password.css'

function PasswordManager() {
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [showPass,setShowPass]=useState(false);
    const [passwords,setPasswords]=useState([]);
    const [isLoaded,setIsLoaded]=useState(false);
    const [itemId,setItemId]=useState(null);
    const [isEditable,setIsEditable]=useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [currentPasswordId,setCurrentPasswordId]=useState(null);

    const handleClick=()=>{
        if(username==='' || password==='') return
        const newEntry={username,password,id:Date.now(),showPass}
        setPasswords((prev)=>[...prev,newEntry]);
        setPassword('');
        setUsername('');
    }
    
    useEffect(()=>{
        const storedPassword=localStorage.getItem('pwd');
        if(storedPassword){
            setPasswords(JSON.parse(storedPassword))
        }
        setIsLoaded(true)
    },[])

    useEffect(()=>{
        console.log('Updated passwords:', passwords);
        if(isLoaded){
            localStorage.setItem('pwd',JSON.stringify(passwords))
        }
        // if(passwords.length>0){
        //     localStorage.setItem('pwd',JSON.stringify(passwords))  //This thing will always store a minimum 1 length of password. So that i am not using this.
        // }
    },[passwords,isLoaded])


    const handleRemove=(id)=>{
        const afterDlt=passwords.filter((pwd)=>pwd.id!==id)
        setPasswords(afterDlt)
    }

    const handleEdit=(id,userId,userPass)=>{
        setIsDisabled(!isDisabled)
        setIsEditable(!isEditable);
        setUsername(userId);
        setPassword(userPass);
        setItemId(id)
    }
    const handleSave=(id)=>{
        setPasswords((prevPasswords)=>
            prevPasswords.map((item)=>
                item.id===id?{...item,username,password}:item
            ) 
        )
        
        setUsername('');
        setPassword('');
        setItemId(null)
        setIsDisabled(!isDisabled)
        setIsEditable(!isEditable)
    }

    const handleShowPass=(id)=>{
        setCurrentPasswordId(id);
        setPasswords((prevPasswords)=>(
            prevPasswords.map((item)=>(
                item.id===id?{...item,showPass:!item.showPass}:item
            ))
        ))
    }


    const checkCurrentPassShowSatus=(id)=>{
        const currentItem=passwords.find((item)=>item.id===id);
        const status = currentItem?currentItem.showPass:false;
        return status
    }

  return (
    <div className='password-manager'>
        <h2>Password Manager</h2>
        <div className="input-fields">
            {/* <h4>Add Password</h4> */}
            <p>Add Password</p>
            <input type="text"placeholder='username/id' onChange={(e)=>setUsername(e.target.value)} value={username}/>
            <input 
            // type={showPass?'text':"password"}
            type={checkCurrentPassShowSatus(currentPasswordId)?'text':"password"}
            
            placeholder='password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
            <button onClick={isEditable?()=>handleSave(itemId):()=>handleClick()}>
                {
                    isEditable?'Save':'Add Passowrd'
                }
            </button>
        </div>
        <div className="password">
            <h4>Passwords</h4>
            <div className="items">
                {
                    (!passwords.length) ? <div style={{
                        textAlign:'center',
                        paddingBottom:'20px'
                    }}>No password to show</div>:

                    passwords.map((item,index)=>{
                        return <div key={index} className='passwords'>
                            <div className="password-data">
                                <div><b>Username:</b> 
                                <input 
                                style={{outline:'none',border:'none'}}
                                type="text" value={item.username} readOnly/>
                                </div>
                                <div><b>Password:</b> <input
                                style={{
                                    border:isEditable?'null':'none',
                                    outline:isEditable?'null':'none'
                                }}

                                type={item.showPass?'text':'password'}
                                 value={item.password} 
                                 readOnly={isEditable?true:false}
                                 /></div>
                            </div>
                            <div className='btns'>
                                <button 
                                style={{
                                    backgroundColor:isDisabled?'gray':null
                                }}
                                disabled={isDisabled}
                                onClick={()=>handleEdit(item.id,item.username,item.password)}
                                className='btn-style' 
                                >
                                Edit 
                                </button>
                                <button 
                                // onClick={()=>setShowPass(!showPass)}
                                onClick={()=>handleShowPass(item.id)}
                                
                                className='btn-style'>
                                {
                                    item.showPass?'Hide password':'Show password'
                                }
                                </button>
                                <button 
                                onClick={()=>handleRemove(item.id)}
                                className='btn-style'>Remove</button>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default PasswordManager