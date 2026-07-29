import chalk from "chalk";

function getCurrentTimestamp() {
  const now = new Date();

  const pad = (num, size = 2) => String(num).padStart(size, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}`;
}

class Logger {
  static log(message, data = "") {
    console.log(
      `\n${chalk.gray(getCurrentTimestamp())} ${chalk.green.bold("LOG")}   ${message}`
    );

    if (data !== "") {
      console.log(data);
    }
  }

  static info(message, data = "") {
    console.log(
      `\n${chalk.gray(getCurrentTimestamp())} ${chalk.blue.bold("INFO")}  ${message}`
    );

    if (data !== "") {
      console.log(data);
    }
  }

  static warn(message, data = "") {
    console.log(
      `\n${chalk.gray(getCurrentTimestamp())} ${chalk.yellow.bold("WARN")}  ${message}`
    );

    if (data !== "") {
      console.log(data);
    }
  }

  static error(message, data = "") {
    console.log(
      `\n${chalk.gray(getCurrentTimestamp())} ${chalk.red.bold("ERROR")} ${message}`
    );

    if (data !== "") {
      console.log(data);
    }
  }

  static debug(message, data = "") {
    console.log(
      `\n${chalk.gray(getCurrentTimestamp())} ${chalk.magenta.bold("DEBUG")} ${message}`
    );

    if (data !== "") {
      console.log(data);
    }
  }

  static trace(message, data = "") {
    console.log(
      `\n${chalk.gray(getCurrentTimestamp())} ${chalk.cyan.bold("TRACE")} ${message}`
    );

    if (data !== "") {
      console.trace(data);
    }
  }
}

export default Logger;
