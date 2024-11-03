// search bar
// open: {

// },
// closed: {

// }

export const containerAnim = {
    open: {
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.5,
        }
    },
    closed: {
        transition: {
            staggerChildren: 0.3,
            delayChildren: -1,
        }

    }
}

export const logAnim = {
    open: {
        y: 0,
    }
}

export const headAnim = {
    open: {
        y: 0,
        transition: {
            duration: 2,
            delay: 2,
        }
    }, 
    closed: {
        y: 20,
        transition: {
            duration: 0.3
        }
    }
}