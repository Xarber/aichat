class Chat {
    constructor(chatContainer, options = {}) {
        this.chat = chatContainer;
        this.update(options);
    }

    icons = {
        call: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M763-145q-121-9-229.5-59.5T339-341q-86-86-135.5-194T144-764q-2-21 12.29-36.5Q170.57-816 192-816h136q17 0 29.5 10.5T374-779l24 106q2 13-1.5 25T385-628l-97 98q20 38 46 73t57.97 65.98Q422-361 456-335.5q34 25.5 72 45.5l99-96q8-8 20-11.5t25-1.5l107 23q17 5 27 17.5t10 29.5v136q0 21.43-16 35.71Q784-143 763-145ZM255-600l70-70-17.16-74H218q5 38 14 73.5t23 70.5Zm344 344q35.1 14.24 71.55 22.62Q707-225 744-220v-90l-75-16-70 70ZM255-600Zm344 344Z"/></svg>`,
        videocall: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M216-192q-29 0-50.5-21.5T144-264v-432q0-29.7 21.5-50.85Q187-768 216-768h432q29.7 0 50.85 21.15Q720-725.7 720-696v168l144-144v384L720-432v168q0 29-21.15 50.5T648-192H216Zm0-72h432v-432H216v432Zm0 0v-432 432Z"/></svg>`,
        send: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M144-192v-576l720 288-720 288Zm72-107 454-181-454-181v109l216 72-216 72v109Zm0 0v-362 362Z"/></svg>`,
        sendAsOther: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="m672-192 108-108-34-34-50 50v-100h-48v100l-50-50-34 34 108 108Zm-528 0v-576l542 216q-40 0-67 5.5T557-525L216-661v109l216 72-216 72v109l210-83q-8 20-12.5 41.5T408-298L144-192Zm528 96q-80 0-136-56t-56-136q0-80 56-136t136-56q80 0 136 56t56 136q0 80-56 136T672-96ZM216-408v-253 362-109Z"/></svg>`,
        scheduleSend: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M144-192v-576l542 216q-40 0-67 5.5T557-525L216-661v109l216 72-216 72v109l210-83q-8 20-12.5 41.5T408-298L144-192Zm528 96q-80 0-136-56t-56-136q0-80 56-136t136-56q80 0 136 56t56 136q0 80-56 136T672-96Zm55-103 34-34-65-65v-86h-48v106l79 79ZM216-408v-253 362-109Z"/></svg>`,
        file: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z"/></svg>`,
        menu: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M144-264v-72h672v72H144Zm0-180v-72h672v72H144Zm0-180v-72h672v72H144Z"/></svg>`,
        addFriend: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M708-432v-84h-84v-72h84v-84h72v84h84v72h-84v84h-72Zm-324-48q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM96-192v-92q0-25.78 12.5-47.39T143-366q55-32 116-49t125-17q64 0 125 17t116 49q22 13 34.5 34.61T672-284v92H96Zm72-72h432v-20q0-6.47-3.03-11.76-3.02-5.3-7.97-8.24-47-27-99-41.5T384-360q-54 0-106 14.5T179-304q-4.95 2.94-7.98 8.24Q168-290.47 168-284v20Zm216.21-288Q414-552 435-573.21t21-51Q456-654 434.79-675t-51-21Q354-696 333-674.79t-21 51Q312-594 333.21-573t51 21Zm-.21-73Zm0 361Z"/></svg>`,
        newGroup: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M450-483q26-30 40-66.12 14-36.12 14-74.88 0-38.41-14-74.21Q476-734 450-765q8-2 15-2.5t15-.5q60 0 102 42t42 102q0 60-42 102t-102 42q-8 0-15.5-.5T450-483Zm198 291v-92q0-41-19-76.5T576-421q68 16 130 44t62 93v92H648Zm132-240v-84h-84v-72h84v-84h72v84h84v72h-84v84h-72Zm-492-48q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM0-192v-92q0-25.41 12.5-46.7Q25-352 47-366q54-34 115.54-50 61.54-16 125-16T412-415q61 17 117 49 21 14 34 35.3 13 21.29 13 46.7v92H0Zm287.5-360q29.5 0 51-21 21.5-21.01 21.5-50.5 0-29.5-21.5-51t-51-21.5q-29.49 0-50.5 21.5-21 21.5-21 51 0 29.49 21 50.5 21.01 21 50.5 21ZM72-264h432v-20q0-6.07-3-11.03-3-4.97-8-8.97-48-26-99.5-41t-106-15q-54.5 0-106 14.5T83-304q-5 4-8 8.97-3 4.96-3 11.03v20Zm216-360Zm0 360Z"/></svg>`,
        plus: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg>`,
        attach: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M696-312q0 89.86-63.07 152.93Q569.86-96 480-96q-91 0-153.5-65.5T264-319v-389q0-65 45.5-110.5T420-864q66 0 111 48t45 115v365q0 40.15-27.93 68.07Q520.15-240 480-240q-41 0-68.5-29.09T384-340v-380h72v384q0 10.4 6.8 17.2 6.8 6.8 17.2 6.8 10.4 0 17.2-6.8 6.8-6.8 6.8-17.2v-372q0-35-24.5-59.5T419.8-792q-35.19 0-59.5 25.5Q336-741 336-706v394q0 60 42 101.5T480-168q60 1 102-43t42-106v-403h72v408Z"/></svg>`,
        hollowCircle: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M480-96q-78.72 0-148.8-30.24-70.08-30.24-122.4-82.56-52.32-52.32-82.56-122.4Q96-401.28 96-480q0-79.68 30.24-149.28T208.8-751.2q52.32-52.32 122.4-82.56Q401.28-864 480-864q79.68 0 149.28 30.24T751.2-751.2q52.32 52.32 82.56 121.92Q864-559.68 864-480q0 78.72-30.24 148.8-30.24 70.08-82.56 122.4-52.32 52.32-121.92 82.56Q559.68-96 480-96Zm0-144q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Z"/></svg>`,
    };

    update(options = {}) {
        this.chat ??= document.createElement('div');
        this.currentChatIndex = -1;

        this.userData = options.userData ?? {
            username: "Unknown",
            avatar: "https://placehold.co/400",
        }

        this.openChats = options.openChats ?? [];

        this.loadChatData = options.loadChatData ?? ((chatId)=>{});
        this.updateChatData = options.debugUpdateChatData ?? ((chatId, newData)=>{});
        this.sendMessage = options.sendMessage ?? ((chatId, messageData)=>{});

        this.render();
    }

    render() {
        this.chat.className = 'chat';
        this.chat.innerHTML = `
            <div class="sidebar">
                <div class="header">
                    <button class="menuBtn" onclick="document.querySelector('.chat').querySelector('.sidebar').classList.toggle('extended');">${this.icons.menu}</button>
                    <div class="avatar">
                        <img src="${this.userData.avatar}" alt="">
                    </div>
                    <div class="username">${this.userData.username}</div>
                </div>
                <div class="users"></div>
            </div>
            <div class="content"></div>
        `;

        this.renderOpenChats();
        this.renderChat(this.openChats[this.currentChatIndex]);
        this.addEventListeners(true);
    }

    findNearestElement(element, query = "*") {
        while (element.parentNode) {
            let found = false;
            element.parentNode.querySelectorAll(query).forEach(e=>found = !!found || e === element);
            if (found) return element;
            element = element.parentNode;
        }
        return false;
    }

    async fetchAndStream(url, options, onDataCallback = console.log) {
        const response = await fetch(url, options);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
    
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
            onDataCallback(result, false);
        }
    
        onDataCallback(result, true);
        return result;
    }

    addEventListeners(addSidebarListener = false) {
        const sidebar = this.chat.querySelector('.sidebar');
        if (addSidebarListener === true) sidebar.addEventListener('click', (event) => {
            const nearest = chat.findNearestElement(event.target, ".user");
            if (!nearest || !nearest.dataset.index) return;
            this.currentChatIndex = nearest.dataset.index;
            this.renderChat(this.openChats[this.currentChatIndex]);
        });

        const chatActions = this.chat.querySelector('.content').querySelector('.input');
        const chatHeader = this.chat.querySelector('.content').querySelector('.header');
        if (!chatActions || !chatHeader) return;

        chatActions.querySelector('input').addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.send(chatActions.querySelector('input').value);
                chatActions.querySelector('input').value = "";
            }
        });

        chatActions.querySelectorAll('button').forEach(e=>{
            e.addEventListener('click', () => {
                switch (e.dataset.type) {
                    case 'send':
                        this.send(chatActions.querySelector('input').value);
                        chatActions.querySelector('input').value = "";
                        break;
                    case 'sendAsOther':
                        this.debugAddMessage(chatActions.querySelector('input').value, undefined, "user");
                        chatActions.querySelector('input').value = "";
                        break;
                    case 'scheduleSend':
                        this.debugAddMessage(chatActions.querySelector('input').value, undefined, "system");
                        chatActions.querySelector('input').value = "";
                        break;
                }
            })
        });
    }

    renderOpenChats() {
        const userDiv = this.chat.querySelector('.sidebar').querySelector('.users');
        userDiv.innerHTML = '';
        this.openChats.forEach((chat, index) => {
            userDiv.innerHTML += `
                <div class="user" data-id="${chat.id}" data-index="${index}">
                    <div class="avatar">
                        <img src="${chat.icon}" alt="">
                    </div>
                    <div class="username">${chat.name}</div>
                </div>
            `;
        });
        if (this.openChats.length === 0) {
            userDiv.innerHTML += `
                <span>There are no open chats!</span>
            `;
        }
    }

    renderChat(chatObject = this.openChats[this.currentChatIndex]) {
        if (!chatObject) return;
        const chatDiv = this.chat.querySelector('.content');
        const chatData = this.loadChatData(chatObject.id);
        chatDiv.innerHTML = `
            <div class="header">
                <div class="sender-name user">
                    <div class="avatar">
                        <img src="${chatObject.icon}" alt="">
                    </div>
                    <div class="username">${chatObject.name}</div>
                </div>
                <div class="actions">
                    <button>${this.icons.call}</button>
                    <button>${this.icons.videocall}</button>
                </div>
            </div>
            <div class="messages"></div>
            <div class="input">
                <input type="text">
                <button data-type="sendAsOther">${this.icons.sendAsOther}</button>
                <button data-type="scheduleSend">${this.icons.scheduleSend}</button>
                <button data-type="send">${this.icons.send}</button>
            </div>
        `;
        this.renderMessages(chatData.messages);
        this.addEventListeners();
    }

    renderMessages(chatMessages = this.loadChatData(this.openChats[this.currentChatIndex].id).messages) {
        let lastMessageSender = false;
        const chatMessagesDivEl = this.chat.querySelector('.content').querySelector('.messages');
        let chatMessagesDiv = {innerHTML: ""};
        chatMessagesDiv.innerHTML = '';
        chatMessages.forEach((message) => {
            if (!lastMessageSender) {
                chatMessagesDiv.innerHTML += `<div class="bubbleGroup">`;
                if (message.sender === "system") {
                    chatMessagesDiv.innerHTML += `<div style="display: none"></div>`;
                } else {
                    chatMessagesDiv.innerHTML += `<div class="bubble senderAvatar avatar">
                        <img src="${message.author.avatar}" alt="">
                    </div>`;
                }
                chatMessagesDiv.innerHTML += `<div class="bubbleGroupMessage">`;
            }
            else if (lastMessageSender != message.sender) {
                chatMessagesDiv.innerHTML += `</div></div><div class="bubbleGroup">`;
                if (message.sender === "system") {
                    chatMessagesDiv.innerHTML += `<div style="display: none"></div>`;
                } else {
                    chatMessagesDiv.innerHTML += `<div class="bubble senderAvatar avatar">
                        <img src="${message.author.avatar}" alt="">
                    </div>`;
                }
                chatMessagesDiv.innerHTML += `<div class="bubbleGroupMessage">`;
            }
            
            chatMessagesDiv.innerHTML += `
                <div class="bubble${message.sender === "system" ? " system" : (
                    message.sender === "own" ? " sent" : ""
                )}">
                    <div class="header">${message.author.username}</div>
                    <div class="content">${message.content}</div>
                    <div class="footer">${this.formatTimestamp(message.date)}</div>
                </div>
            `;
            lastMessageSender = message.sender;
        });
        if (chatMessages.length > 0) {
            chatMessagesDiv.innerHTML += `</div></div>`;
        }
        chatMessagesDiv.innerHTML += `
            <div class="bubbleGroup typingBubbleGroup" style="display: none;">
                <div class="bubble senderAvatar avatar">
                    <img src="" alt="">
                </div>
                <div class="bubbleGroupMessage">
                    <div class="bubble">
                        <div class="header">User</div>
                        <div class="content">${this.icons.hollowCircle}${this.icons.hollowCircle}${this.icons.hollowCircle}</div>
                        <div class="footer">Now</div>
                    </div>
                </div>
            </div>
        `;
        chatMessagesDivEl.innerHTML = chatMessagesDiv.innerHTML;
    }

    send(content, chatId = this.openChats[this.currentChatIndex].id) {
        if (!content) return;

        this.sendMessage(chatId, {
            sender: "own",
            content: content,
            author: this.userData,
            date: new Date().getTime()
        });
        this.renderMessages(this.loadChatData(chatId).messages);
        
        const chatMessagesDiv = this.chat.querySelector('.content').querySelector('.messages');
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }

    async AIPrompt(content, callback, model = "gemma2") {
        await this.fetchAndStream('http://localhost:11434/api/generate', {
            method: "POST",
            body: JSON.stringify({
                model: model,
                prompt: content
            })
        }, callback ?? ((data, isDone)=>{
            data = data.split("\n");
            let result = "";
            
            for (var line of data) {
                try {data = JSON.parse(line)} catch(e) {continue;}
                result += data.response;
                console.log(result);
            }
        }));
    }

    debugAddMessage(content, chatId = this.openChats[this.currentChatIndex].id, sender = "user") {
        if (!content) return;

        const currentChatData = this.loadChatData(chatId);
        this.updateChatData(chatId, {
            ...currentChatData,
            messages: [...currentChatData.messages, {
                sender,
                content,
                author: sender === "own" ? this.userData : {
                    username: "User",
                    avatar: "https://placehold.co/400"
                },
                date: new Date().getTime()
            }]
        });

        this.renderMessages(this.loadChatData(chatId).messages);

        const chatMessagesDiv = this.chat.querySelector('.content').querySelector('.messages');
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }

    userTyping(state = false) {
        this.chat.querySelector('.content').querySelector('.typingBubbleGroup').style.display = state ? "flex" : "none";
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        // Controlla se è oggi
        if (date.toDateString() === today.toDateString()) {
          return `Today at ${hours}:${minutes}`;
        }
        
        // Controlla se è ieri
        if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${hours}:${minutes}`;
        }
        
        // Per altre date, mostra il formato giorno/mese
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month} at ${hours}:${minutes}`;
    }
}