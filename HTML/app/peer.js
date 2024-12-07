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

    userStream = [false, {
        toggleMicrophone: cb=>this.#toggleMicrophone(cb),
        toggleWebcam: cb=>this.#toggleWebcam(cb),
        toggleScreenSharing: cb=>this.#toggleScreenSharing(cb),
        close: cb=>this.#closeUserStream(cb)
    }];

    getUserStream(constraints = { audio: true }, callback, errorCallback) {
        const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices?.getUserMedia;

        if (!getUserMedia) {
            const error = new Error("getUserMedia is not supported in this browser.");
            this.eventHandlers?.onCallError?.(error);
            return;
        }

        if (this.userStream[0]) return callback?.(...this.userStream);

        getUserMedia(constraints, stream => {
            this.userStream[0] = stream;
            callback?.(...this.userStream);
        }, err => {
            this.eventHandlers?.onCallError?.(err);
            errorCallback?.(err);
        });
    }

    #toggleMicrophone(callback, errorCallback) {
        if (!this.userStream[0]) {
            console.error("No active stream found to toggle the microphone.");
            return;
        }

        const audioTrack = this.userStream[0].getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.stop();
            this.userStream[0].removeTrack(audioTrack);
        } else {
            const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices?.getUserMedia;
            getUserMedia({ audio: true }, newStream => {
                const newAudioTrack = newStream.getAudioTracks()[0];
                this.userStream[0].addTrack(newAudioTrack);
                callback?.(...this.userStream);
            }, err => {
                console.error("Failed to toggle microphone:", err);
                errorCallback?.(err);
            })
        }
    }

    #toggleWebcam(callback, errorCallback) {
        if (!this.userStream[0]) {
            console.error("No active stream found to toggle the webcam.");
            return;
        }

        const videoTrack = peer.userStream[0].getVideoTracks().filter(e=>e.label.indexOf('screen') === -1)[0];
        if (videoTrack) {
            videoTrack.stop();
            this.userStream[0].removeTrack(videoTrack);
        } else {
            const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices?.getUserMedia;
            getUserMedia({ video: true }, newStream => {
                const newVideoTrack = newStream.getVideoTracks()[0];
                this.userStream[0].addTrack(newVideoTrack);
                callback?.(...this.userStream);
            }, err => {
                console.error("Failed to toggle webcam:", err);
                errorCallback?.(err);
            })
        }
    }

    #toggleScreenSharing(callback, errorCallback) {
        if (!this.userStream[0]) {
            console.error("No active stream found to toggle screen sharing.");
            return;
        }

        const screenTrack = this.userStream[0].getVideoTracks().find(track => track.label.includes("screen"));

        if (screenTrack) {
            screenTrack.stop();
            this.userStream[0].removeTrack(screenTrack);
            callback?.(...this.userStream);
        } else {
            if (!navigator.mediaDevices?.getDisplayMedia) {
                const error = new Error("getDisplayMedia is not supported in this browser.");
                this.eventHandlers?.onCallError?.(error);
                return;
            }

            navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                .then(screenStream => {
                    const newScreenTrack = screenStream.getVideoTracks()[0];

                    newScreenTrack.onended = () => {
                        this.userStream[0].removeTrack(newScreenTrack);
                        callback?.(...this.userStream);
                    };

                    this.userStream[0].addTrack(newScreenTrack);
                    callback?.(...this.userStream);
                })
                .catch(err => {
                    console.error("Failed to toggle screen sharing:", err);
                    errorCallback?.(err);
                });
        }
    }

    #closeUserStream(callback) {
        if (!this.userStream[0]) {
            console.warn("No active stream found to close.");
            return;
        }

        this.userStream[0].getTracks().forEach(t=>{t.stop();});
        this.userStream[0] = false;

        callback?.(...this.userStream);
    }

    callPeer() {
        this.getUserStream({video: true, audio: true}, function(stream) {

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