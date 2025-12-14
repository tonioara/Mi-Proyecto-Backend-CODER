const socket = io();
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const userEmailInput = document.getElementById('userEmail'); 
const messagesContainer = document.getElementById('messagesContainer');
const typingIndicator = document.getElementById('typingIndicator');

let userName = ''; 


const appendMessage = (data) => {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>[${data.time}] ${data.user}:</strong> ${data.message}`;
    messagesContainer.appendChild(messageElement);
   
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

const askForUsername = async () => {
    const { value: username } = await Swal.fire({
        title: 'Ingresa tu nombre para chatear',
        input: 'text',
        inputLabel: 'Nombre de usuario',
        inputValue: '',
        allowOutsideClick: false, 
        inputValidator: (value) => {
            if (!value) {
                return '¡Necesitas ingresar un nombre para continuar!';
            }
        }
    });

    if (username) {
        userName = username;
        userEmailInput.value = userName; 
        userEmailInput.setAttribute('disabled', true);
        socket.emit('user:connected', userName); 
    }
};

askForUsername(); 

socket.on('chat:loadHistory', (messages) => {
    messagesContainer.innerHTML = ''; 
    messages.forEach(appendMessage);
});


socket.on('chat:message', (data) => {
    typingIndicator.textContent = ''; 
    appendMessage(data);
});


socket.on('user:newConnection', (username) => {
    
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `${username} se ha unido al chat.`,
        icon: 'success'
    });
});



let typingTimeout;
messageInput.addEventListener('input', () => {
    
    if (userName) {
        socket.emit('chat:typing', userName); 
        
        clearTimeout(typingTimeout); 
        
        typingTimeout = setTimeout(() => {
            socket.emit('chat:typing', null); 
        }, 3000);
    }
});

socket.on('chat:typing', (username) => {
    
    if (username && username !== userName) { 
        typingIndicator.textContent = `${username} está escribiendo...`;
    } else {
        typingIndicator.textContent = '';
    }
});




chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    
    const user = userName; 
    const message = messageInput.value.trim();

    if (user && message) {
        socket.emit('chat:message', { user, message });
        
        messageInput.value = ''; 
        messageInput.focus();
        
        socket.emit('chat:typing', null); 
    }
});