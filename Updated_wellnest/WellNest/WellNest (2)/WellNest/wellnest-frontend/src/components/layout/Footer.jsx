import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, Utensils, Calculator, User, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
    const { user } = useAuth();

    const userItems = [
        { icon: <Home size={22} />, label: 'Home', path: '/dashboard' },
        { icon: <Activity size={22} />, label: 'Activity', path: '/activity' },
        { icon: <Utensils size={22} />, label: 'Nutrition', path: '/nutrition' },
        { icon: <Calculator size={22} />, label: 'BMI', path: '/bmi' },
        { icon: <Users size={22} />, label: 'Social', path: '/community' },
        { icon: <User size={22} />, label: 'Profile', path: '/profile' },
    ];

    const trainerItems = [
        { icon: <Home size={22} />, label: 'Console', path: '/trainer/dashboard' },
        { icon: <Users size={22} />, label: 'Social', path: '/community' },
        { icon: <User size={22} />, label: 'Profile', path: '/profile' },
    ];

    const navItems = user?.role === 'TRAINER' ? trainerItems : userItems;

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    {({ isActive }) => (
                        <>
                            <div style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.3s ease' }}>
                                {item.icon}
                            </div>
                            <span>{item.label}</span>
                            {isActive && <div className="active-indicator" />}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default Footer;
