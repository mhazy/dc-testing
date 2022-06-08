import React from 'react';

import { UserContext } from "../context/user";

export const AuthRequired: React.FC = ({ children }) => {
    const { user } = React.useContext(UserContext);
    return user ?
        (<>{children}</>) :
        null;
}
