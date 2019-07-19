import axios from 'axios';

export class Api {
  public static createPoll(
    apiToken: string,
    prompt: string,
    answerChoices: string[]
  ): Promise<any> {
    const url = process.env.VUE_APP_API_URL + 'polls';

    return axios.post(
      url,
      {
        prompt,
        answer_choices: JSON.stringify(answerChoices)
      },
      { headers: { Authorization: apiToken } }
    );
  }
  public static saveResponse(
    apiToken: string,
    pollId: string,
    answerChoice: string
  ): Promise<any> {
    const url = process.env.VUE_APP_API_URL + 'polls/' + pollId + '/responses';

    return axios.post(
      url,
      {
        poll_id: pollId,
        value: answerChoice
      },
      { headers: { Authorization: apiToken } }
    );
  }
  public static getPollData(apiToken: string, pollId: string): Promise<any> {
    const url = process.env.VUE_APP_API_URL + 'polls/' + pollId;
    return axios.get(url, {
      headers: {
        Authorization: apiToken
      }
    });
  }

  public static getOwnResponse(apiToken: string, pollId: string): Promise<any> {
    const url =
      process.env.VUE_APP_API_URL + 'polls/' + pollId + '/responses/self';
    return axios.get(url, {
      headers: {
        Authorization: apiToken
      }
    });
  }
  public static getAggregateData(
    apiToken: string,
    pollId: string
  ): Promise<any> {
    const url = process.env.VUE_APP_API_URL + 'polls/' + pollId + '/responses';
    return axios.get(url, {
      headers: {
        Authorization: apiToken
      }
    });
  }
  public static getLTIData(hash: string) {
    const url = process.env.VUE_APP_API_URL + 'get/' + hash;
    return axios.get(url);
  }
}
