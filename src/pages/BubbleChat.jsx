// import React, { useState } from 'react';

// const BubbleChat = () => {
//     const [isHovered, setIsHovered] = useState(false);

//     const handleClick = () => {
//         window.open('https://lawyer-c79df0.zapier.app/', '_blank'); // Replace with your chat URL
//     };

//     const bubbleStyle = {
//         width: '60px',
//         height: '60px',
//         backgroundColor: '#007bff',
//         color: 'white',
//         borderRadius: '50%',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         cursor: 'pointer',
//         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         zIndex: 1000,
//         fontSize: '24px',
//     };

//     const tooltipStyle = {
//         position: 'absolute',
//         bottom: '80px', // Position above the bubble
//         right: '20px',
//         backgroundColor: '#333',
//         color: '#fff',
//         padding: '5px 10px',
//         borderRadius: '5px',
//         fontSize: '14px',
//         whiteSpace: 'nowrap',
//         visibility: isHovered ? 'visible' : 'hidden',
//         opacity: isHovered ? 1 : 0,
//         transition: 'opacity 0.3s ease',
//         zIndex: 1001, // Ensure tooltip is above the bubble
//     };

//     return (
//         <div style={{ position: 'relative' }}>
//             <div
//                 style={bubbleStyle}
//                 onClick={handleClick}
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//             >
//                 💬
//             </div>
//             <div style={tooltipStyle}>
//                 Start a conversation 
//             </div>
//         </div>
//     );
// };  
// export default BubbleChat;
import React, { useState } from 'react';

const BubbleChat = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        window.open('https://lawyer-c79df0.zapier.app/', '_blank'); // Replace with your chat URL
    };

    const bubbleStyle = {
        width: '60px',
        height: '60px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        fontSize: '24px',
    };

    const tooltipStyle = {
        position: 'absolute',
        bottom: '80px', // Position above the bubble
        right: '50%', // Center horizontally
        transform: 'translateX(50%)', // Adjust to center the tooltip
        backgroundColor: '#333',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        visibility: isHovered ? 'visible' : 'hidden',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 1001, // Ensure tooltip is above the bubble
    };

    return (
        <div style={{ position: 'relative' }}>
            <div
                style={bubbleStyle}
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                💬
            </div>
            <div style={tooltipStyle}>
                Start a conversation
            </div>
        </div>
    );
};

export default BubbleChat;