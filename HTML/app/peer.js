class PeerConnection {
    constructor(manager, partyID, eventHandlers, connection) {
        this.status = 'stall';
        this.manager = manager ?? new PeerConnectionManager().getManager();

        this.update(partyID, eventHandlers, connection);
    }

    update(partyID, eventHandlers = {}, connection) {
        this.eventHandlers = eventHandlers ?? this.eventHandlers ?? {};

        if (this.partyID != partyID && !!partyID) {

            this.#connect(connection, this.manager, partyID);

        }

        this.partyID = partyID ?? this.partyID ?? null;
    }

    #connect(connection, manager, partyID) {
        this.connection = connection;
        this.connection ??= manager.connect(partyID);
        this.status = 'pending';

        this.connection.on('open', () => {

            this.status = 'success';
            this.eventHandlers?.onReady?.();

            this.connection.on('data', (data)=>{

                this.connection.latency = new Date().getTime() - data.debugSentMessageData.timestamp;
                this.eventHandlers?.onData?.(data);

            });

        });
        this.connection.on('close', () => {

            this.eventHandlers?.onClose?.();

            for (var property in this) {
                
                delete this[property];

            }

            this.status = 'closed';

        });
        this.connection.on('error', (error) => {

            this.eventHandlers?.onError?.(error);

        });
    }

    close() {
        this.connection?.close();
        this.status = 'closed';
        this.connection = null;
        this.call = null;
    }

    sendData(data) {
        if (this.status != 'success') return false;
        data = {
            debugSentMessageData: {
                timestamp: new Date().getTime()
            },
            ...data
        }
        return this.connection.send(data);
    }

    callPeer() {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({video: true, audio: true}, function(stream) {

            this.call = this.manager.call(this.partyID, stream);

            this.call.on('stream', function(remoteStream) {

                this.eventHandlers?.onCallStream?.(remoteStream);

            });

        }, function(err) {
            
            this.eventHandlers?.onCallError?.(err);

        });
    }

    pickupCall(call) {
        this.call = call;
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({video: true, audio: true}, function(stream) {

            this.call.answer(stream);

            this.call.on('stream', function(remoteStream) {

                this.eventHandlers?.onCallStream?.(remoteStream);

            });

        }, function(err) {

            this.eventHandlers?.onCallError?.(err);

        });
    }

    hangupCall() {

        this.call?.close();
        this.call = undefined;

    }
}

class PeerGroupManager {
    //todo
    constructor(manager, peers) {
        this.status = 'stall';
        this.manager = manager ?? new PeerConnectionManager().getManager();

        this.update(peers);
    }

    update(peers = []) {

    }
}

class PeerConnectionManager {
    constructor(peers, eventHandlers) {
        this.peerManager = new Peer();
        this.update(peers, eventHandlers);
    }

    update(peers = [], eventHandlers = {}) {
        this.eventHandlers = eventHandlers ?? this.eventHandlers ?? {};
        this.peers = peers ?? [];
        this.status = 'pending';

        this.peerManager.on('open', (id)=>{

            this.id = id;
            this.status = 'success';
            this.eventHandlers?.onReady?.(id);

        });

        this.peerManager.on('connection', (connection) => {

            this.addPeer("", new PeerConnection(this.peerManager, connection.peer, this.eventHandlers?.newConn, connection));

        });

        this.peerManager.on('call', (call)=>{

            var target = this.getPeerById(call.peer);

            if (target) {

                target.call = call;
                target.eventHandlers?.onCall?.(call);

            }

        });

        this.peerManager.on('close', ()=>{

            this.eventHandlers?.onKill?.();

            for (var property in this) {

                delete this[property];

            }

            this.status = 'killed';

        });

        this.peerManager.on('disconnected', ()=>{

            this.status = 'disconnected';
            this.eventHandlers?.onDisconnect?.();

        });

        this.peerManager.on('error', (error)=>{

            this.status = 'errored';
            this.eventHandlers?.onError?.(error);

        });
    }
    
    getManager() {
        return this.peerManager;
    }

    getPeerById(id) {
        return this.peers.find((peer) => peer.partyID === id);
    }

    addPeer(peerID, connection) {
        let conn = connection ?? new PeerConnection(this.getManager(), peerID, this.eventHandlers?.newConn);
        this.peers.push(conn);
        let index = (this.peers.length - 1);
        this.eventHandlers?.addPeer?.(conn, index);
        return index;
    }

    removePeer(peerID) {
        var peerIndex = this.peers.findIndex((peer) => peer.partyID === peerID);
        if (peerIndex > -1) {
            this.eventHandlers?.removePeer?.(this.peers[peerIndex], peerIndex);
            this.peers[peerIndex] = null;
        }
    }

    toggleConnection(status = this.status != 'success') {
        status
        ? this.peerManager.disconnect()
        : this.peerManager.reconnect();
    }

    kill() {
        this.peerManager.destroy();
    }
}