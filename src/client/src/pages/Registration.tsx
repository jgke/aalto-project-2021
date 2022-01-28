import React from 'react';
import { RegistrationForm } from '../components/RegistrationForm';
import { createUser } from '../services/userService';
import { Topbar } from '../components/TopBar';

export const Registration: React.FC = () => {
    return (
        <div>
            <Topbar username={null} email={null} token={null} />
            <RegistrationForm createUser={createUser} />
        </div>
    );
};
