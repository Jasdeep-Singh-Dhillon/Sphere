interface ProduceResponse {
  type: "produceResponse";
  requestId: string | undefined;
  payload?: { id: string };
  error?: unknown;
}
export default ProduceResponse;
