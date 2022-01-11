import React from 'react'

export const RegistrationForm: React.FC = () => {

    const handleSubmit = () => {
        console.log('ok')
    }

    return (
        
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                
                <label htmlFor="email"><b>Email</b></label>
                <input 
                    type="text" 
                    placeholder="Enter Email" 
                    name="email"
                    id="email"
                    required
                />
                <label htmlFor="psw"><b>Password</b></label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    name="psw"
                    id="psw"
                    required
                />
                <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
                <input
                    type="password"
                    placeholder="Repeat Password"
                    name="psw-repeat"
                    id="psw-repeat"
                    required
                />
                
                <button type="submit" className="registerbutton">Register</button>
            
            </form>
        </div>
    );
}