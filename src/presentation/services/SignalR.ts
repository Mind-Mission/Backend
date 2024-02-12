import SignalR from "@microsoft/signalr";

export const connection = new SignalR.HubConnectionBuilder().withUrl('/realtime').build();

connection.start().then(() => connection.invoke("send", "Hello"));

connection.on("send", data => {
  console.log(data);
});
