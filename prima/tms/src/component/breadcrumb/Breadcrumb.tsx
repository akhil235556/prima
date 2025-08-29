import React from 'react';
import './Breadcrumb.css';

import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

function handleClick(event: { preventDefault: () => void; }) {
    event.preventDefault();
}

export default function Breadcrumb() {
    return (
        <Breadcrumbs className="breadcrumb-nav d-none" aria-label="breadcrumb">
            <Link color="inherit" href="/" onClick={handleClick}>User Management</Link>
            <Typography color="textPrimary">Create User</Typography>
        </Breadcrumbs>
    );
}

