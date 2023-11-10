import { addSearchParams, log } from "../helpers/common";
import { Env } from "../index";
import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
} from "../types/telegram";

class Bot {
  token: string;
  api: URL;

  constructor(token: string) {
    this.token = token;
    this.api = new URL(`https://api.telegram.org/bot${token}`);
  }

  // trigger sendMessage command of BotAPI
  sendMessage = async (
    chat_id: number,
    text: string,
    {
      parse_mode,
      disable_web_page_preview,
      disable_notification,
      reply_to_message_id,
      reply_markup,
    }: {
      parse_mode?: string;
      disable_web_page_preview?: boolean;
      disable_notification?: boolean;
      reply_to_message_id?: number;
      reply_markup?:
        | InlineKeyboardMarkup
        | ReplyKeyboardMarkup
        | ReplyKeyboardRemove;
    } = {
      parse_mode: "",
      disable_web_page_preview: false,
      disable_notification: false,
      reply_to_message_id: 0,
    }
  ): Promise<Response> =>
    fetch(
      `${this.api.href}/sendMessage`,
      log({
        body: JSON.stringify({
          chat_id: chat_id,
          text,
          parse_mode: parse_mode,
          disable_web_page_preview: disable_web_page_preview,
          disable_notification: disable_notification,
          reply_to_message_id: reply_to_message_id,
          reply_markup,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

  editMessageText = async (
    chat_id: number,
    message_id: number,
    params: {
      text?: string;
      parse_mode?: string;
      disable_web_page_preview?: boolean;
      reply_markup?:
        | InlineKeyboardMarkup
        | ReplyKeyboardMarkup
        | ReplyKeyboardRemove;
    }
  ): Promise<Response> =>
    fetch(
      `${this.api.href}/editMessageText`,
      log({
        body: JSON.stringify({
          chat_id,
          message_id,
          ...params,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

  // trigger forwardMessage command of BotAPI
  forwardMessage = async (
    chat_id: number,
    from_chat_id: number,
    disable_notification = false,
    message_id: number
  ) =>
    fetch(
      log(
        addSearchParams(new URL(`${this.api.href}/forwardMessage`), {
          chat_id: chat_id.toString(),
          from_chat_id: from_chat_id.toString(),
          message_id: message_id.toString(),
          disable_notification: disable_notification.toString(),
        }).href
      )
    );

  // trigger sendPhoto command of BotAPI
  sendPhoto = async (
    chat_id: number,
    photo: string,
    caption = "",
    parse_mode = "",
    disable_notification = false,
    reply_to_message_id = 0
  ) =>
    fetch(
      log(
        addSearchParams(new URL(`${this.api.href}/sendPhoto`), {
          chat_id: chat_id.toString(),
          photo,
          caption,
          parse_mode,
          disable_notification: disable_notification.toString(),
          reply_to_message_id: reply_to_message_id.toString(),
        }).href
      )
    );

  // trigger sendVideo command of BotAPI
  sendVideo = async (
    chat_id: number,
    video: any,
    duration = 0,
    width = 0,
    height = 0,
    thumb = "",
    caption = "",
    parse_mode = "",
    supports_streaming = false,
    disable_notification = false,
    reply_to_message_id = 0
  ) =>
    fetch(
      log(
        addSearchParams(new URL(`${this.api.href}/sendVideo`), {
          chat_id: chat_id.toString(),
          video: JSON.stringify(video),
          duration: duration.toString(),
          width: width.toString(),
          height: height.toString(),
          thumb: thumb,
          caption: caption,
          parse_mode: parse_mode,
          supports_streaming: supports_streaming.toString(),
          disable_notification: disable_notification.toString(),
          reply_to_message_id: reply_to_message_id.toString(),
        }).href
      )
    );

  // trigger sendAnimation command of BotAPI
  sendAnimation = async (
    chat_id: number,
    animation: any,
    duration = 0,
    width = 0,
    height = 0,
    thumb = "",
    caption = "",
    parse_mode = "",
    disable_notification = false,
    reply_to_message_id = 0
  ) =>
    fetch(
      log(
        addSearchParams(new URL(`${this.api.href}/sendAnimation`), {
          chat_id: chat_id.toString(),
          animation: JSON.stringify(animation),
          duration: duration.toString(),
          width: width.toString(),
          height: height.toString(),
          thumb,
          caption,
          parse_mode,
          disable_notification: disable_notification.toString(),
          reply_to_message_id: reply_to_message_id.toString(),
        }).href
      )
    );

  // trigger sendLocation command of BotAPI
  sendLocation = async (
    chat_id: number,
    latitude: number,
    longitude: number,
    live_period = 0,
    disable_notification = false,
    reply_to_message_id = 0
  ) =>
    fetch(
      log(
        addSearchParams(new URL(`${this.api.href}/sendLocation`), {
          chat_id: chat_id.toString(),
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          live_period: live_period.toString(),
          disable_notification: disable_notification.toString(),
          reply_to_message_id: reply_to_message_id.toString(),
        }).href
      )
    );

  // trigger senPoll command of BotAPI
  sendPoll = async (
    chat_id: number,
    question: string,
    options: string[],
    is_anonymous = false,
    type = "",
    allows_multiple_answers = false,
    correct_option_id = 0,
    explanation = "",
    explanation_parse_mode = "",
    open_period = 0,
    close_date = 0,
    is_closed = false,
    disable_notification = false,
    reply_to_message_id = 0
  ) =>
    fetch(
      log(
        addSearchParams(new URL(`${this.api.href}/sendPoll`), {
          chat_id: chat_id.toString(),
          question,
          options: options.toString(),
          is_anonymous: is_anonymous.toString(),
          type,
          allows_multiple_answers: allows_multiple_answers.toString(),
          correct_option_id: correct_option_id.toString(),
          explanation: explanation,
          explanation_parse_mode: explanation_parse_mode,
          open_period: open_period.toString(),
          close_date: close_date.toString(),
          is_closed: is_closed.toString(),
          disable_notification: disable_notification.toString(),
          reply_to_message_id: reply_to_message_id.toString(),
        }).href
      )
    );

  // trigger senDice command of BotAPI
  sendDice = async (
    chat_id: number,
    emoji = "",
    disable_notification = false,
    reply_to_message_id = 0
  ) =>
    fetch(
      log(
        addSearchParams(new URL(`${this.api.href}/sendDice`), {
          chat_id: chat_id.toString(),
          emoji,
          disable_notification: disable_notification.toString(),
          reply_to_message_id: reply_to_message_id.toString(),
        }).href
      )
    );

  // bot api command to get user profile photos
  getUserProfilePhotos = async (
    user_id: number,
    offset = 0,
    limit = 0
  ): Promise<Response> =>
    fetch(
      log(
        addSearchParams(new URL(`${this.api.href}/getUserProfilePhotos`), {
          user_id: user_id.toString(),
          offset: offset.toString(),
          limit: limit.toString(),
        }).href
      )
    );

  answerCallbackQuery = async (
    callback_query_id: string,
    options: {
      text?: string;
      show_alert?: boolean;
    } = {}
  ) =>
    fetch(new URL(`${this.api.href}/answerCallbackQuery`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callback_query_id,
        ...options,
      }),
    });

  sendDocument = async (params: {
    chat_id: string | number;
    document: Blob;
    fileName: string;
    caption?: string;
    parse_mode?: string;
  }) => {
    const form = new FormData();
    params.caption && form.append("caption", params.caption);
    form.append("chat_id", params.chat_id.toString());
    params.parse_mode &&
      form.append("parse_mode", params.parse_mode.toString());
    form.append("document", params.document, params.fileName);

    return await fetch(new URL(`${this.api.href}/sendDocument`), {
      method: "POST",
      body: form,
    });
  };

  getMe = async () => {
    const ret = await fetch(new URL(`${this.api.href}/getMe`));
    const res = (await ret.json()) as any;
    return res.result;
  };

  getChat = async (chat_id: number | string) => {
    const ret = await fetch(
      new URL(`${this.api.href}/getChat?chat_id=${chat_id}`)
    );
    const res = (await ret.json()) as any;
    return res.result;
  };

  getFile = async (file_id: string) => {
    const ret = await fetch(
      new URL(`${this.api.href}/getFile?file_id=${file_id}`)
    );
    const res = (await ret.json()) as any;
    return `https://api.telegram.org/file/bot${this.token}/${res.result.file_path}`;
  };
}

export default Bot;
