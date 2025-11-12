import { TelnyxRTC } from '@telnyx/webrtc';

const ReceiveCall = () => {
    setTimeout(() => {
        const client = new TelnyxRTC({
            login: 'support36348',
            password: 'avzEja6D',
            socketUrl: 'wss://rtc.telnyx.com:5061'
        });
        const answerCallButton = document.getElementById('answerCall');
        const remoteAudio = document.getElementById('remoteAudio');
        // const localVideo = document.getElementById('localVideo');
        // const remoteVideo = document.getElementById('remoteVideo');
        client.on('telnyx.socket.open', () => {
            console.log('Connected to Telnyx WebRTC');
        });
        client.on('telnyx.error', () => {
            console.log('telnyx.error');
        });
        client.on('telnyx.socket.error', () => {
            console.log('telnyx.socket.error');
        });
        client.on('telnyx.notification', (notification) => {
            console.log("notification",notification);
            if (notification.type === 'callUpdate' && notification.call.state === 'ringing') {
                console.log('Incoming call from:', notification.call.options.remoteCallerName);
                console.log('call:', notification.call);
                console.log('notification:', notification);
                answerCallButton.style.display = 'block';
                answerCallButton.onclick = () => {
                    notification.call.answer();
                    answerCallButton.style.display = 'none';
                };
            }
            if (notification.type === 'callUpdate' && notification.call.state === 'active') {
                console.log('Call answered', notification.call);
                remoteAudio.srcObject = notification.call.remoteStream;
                // remoteVideo.srcObject = notification.call.remoteStream;
                // localVideo.srcObject = notification.call.localStream;
            }
            if (notification.type === 'callUpdate' && notification.call.state === 'hangup') {
                console.log('Call ended');
                remoteAudio.srcObject = null;
            }
        });
        client.enableMicrophone();
        // client.enableWebcam();
        client.connect();
    }, 2000);
    return (
        <>
            <h1>Telnyx WebRTC Example</h1>
            <button id="answerCall">Answer Call</button>
            <audio id="remoteAudio" autoPlay></audio>
            {/* <video
              id="localVideo"
              autoPlay
              playsInline
              className="w-100"
              style={{
                backgroundColor: "#000",
                border: "1px solid #ccc",
                borderRadius: "5px",
                maxHeight: "300px"
              }}
            ></video>
            <video
              id="remoteVideo"
              autoPlay
              playsInline
              className="w-100"
              style={{
                backgroundColor: "#000",
                border: "1px solid #ccc",
                borderRadius: "5px",
                maxHeight: "300px"
              }}
            ></video> */}
        </>
    );
};
export default ReceiveCall;