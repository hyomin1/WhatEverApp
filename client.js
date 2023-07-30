import StompJs from "@stomp/stompjs";

export const client = new StompJs.Client({
  brokerURL: "ws://10.0.2.2:8080/ws",
  forceBinaryWSFrames: true,
  appendMissingNULLonIncoming: true,

  debug: function (str) {
    console.log(str);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});
