interface SendMessage {
  type: "getRouterRTPCapabilities"
}

interface ReceiveMessage {
  type: "",
  data: string,
  
}


export type { SendMessage, ReceiveMessage };