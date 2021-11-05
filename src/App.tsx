import { ChangeEvent, useRef, useState } from "react";
import { MdOutlinePlusOne } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import {
  FiPlus,
  FiMinus,
  FiX,
  FiDivide,
  FiAlertTriangle,
  FiPercent,
} from "react-icons/fi";

import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { api } from "./services/api";

import styles from "./App.module.scss";

const maxInputLength = 50;

function App() {
  const inputListRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const [inputValues, setInputValues] = useState<Array<number | string>>([
    "",
    "",
    "",
  ]);

  function clearAlerts() {
    setError("");
    setResult("");
  }

  function resetState() {
    clearAlerts();
    setInputValues(["", "", ""]);
  }

  function addInput() {
    clearAlerts();

    setInputValues((prev) =>
      inputValues.length <= maxInputLength ? [...prev, ""] : prev
    );

    // await the setInpuValues end
    setTimeout(() => {
      if (inputListRef.current)
        inputListRef.current.scrollTo(0, inputListRef.current.scrollHeight);
    }, 0);
  }

  function removeInput(index: number) {
    clearAlerts();

    setInputValues((prev) => prev.filter((e, i) => i !== index));
  }

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>, index: number) {
    clearAlerts();

    setInputValues((prev) =>
      prev.map((item, i) => (i === index ? ev.target.value : item))
    );
  }

  function calc(operation: "sum" | "subtract" | "multiply" | "divide") {
    clearAlerts();

    const numbers = inputValues.slice(0, inputValues.length - 1);

    if (numbers.some((value) => !String(value))) {
      setError("Preencha todos os campos!");

      return;
    }

    if (
      operation === "divide" &&
      numbers.some((value, i) => i > 0 && Number(value) === 0)
    ) {
      setError("Impossível dividir por ZERO");

      return;
    }

    setIsLoading(true);

    api
      .post<number>(`/${operation}`, { numbers })
      .then((response) => setResult(response.data.toString()))
      .catch((err) => setError(`Ocorreu um erro: '${err.message}'`))
      .finally(() => setIsLoading(false));
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.titleIcon}>
          <FiPercent />
        </span>
        Calculadora
      </h1>

      <form
        className={styles.formContainer}
        onSubmit={(ev) => ev.preventDefault()}
      >
        <div className={styles.mainPanel}>
          <div ref={inputListRef} className={styles.inputList}>
            {inputValues.map((value, i) =>
              i < inputValues.length - 1 ? (
                <Input
                  key={i}
                  type="number"
                  placeholder={`Valor ${i + 1}`}
                  autoFocus={i === inputValues.length - 1 && i > 1}
                  canClear={i > 1}
                  onClearClick={() => removeInput(i)}
                  value={value}
                  onChange={(ev) => handleInputChange(ev, i)}
                  required
                />
              ) : (
                i < maxInputLength && (
                  <Input
                    key={i}
                    icon={<MdOutlinePlusOne size={20} />}
                    type="number"
                    placeholder="Adicionar"
                    preLoaded
                    onFocus={addInput}
                    value={value}
                    readOnly
                  />
                )
              )
            )}
          </div>

          <div className={styles.result}>
            <Button
              className={styles.refreshButton}
              icon={<IoMdRefresh size={22} />}
              type="button"
              background="#eeeeee"
              title="Limpar dados"
              onClick={resetState}
            />

            {isLoading ? (
              <h3>Calculando...</h3>
            ) : result ? (
              <>
                <h2>O resultado é:</h2>
                <p className={styles.message}>{result}</p>
              </>
            ) : error ? (
              <>
                <FiAlertTriangle size={120} color="#fcdd5781" />

                <p className={styles.errorMessage}>
                  <span>*</span> {error}
                </p>
              </>
            ) : (
              <h2>Realize uma operação</h2>
            )}
          </div>
        </div>

        <div className={styles.buttonList}>
          <Button
            text="Somar"
            icon={<FiPlus />}
            type="submit"
            color="white"
            background="#1acf84"
            iconBackground="#14b16f"
            onClick={() => calc("sum")}
          />
          <Button
            text="Subtrair"
            icon={<FiMinus />}
            type="submit"
            color="white"
            background="#f0a038"
            iconBackground="#cc8425"
            onClick={() => calc("subtract")}
          />
          <Button
            text="Multiplicar"
            icon={<FiX />}
            type="submit"
            color="white"
            background="#44caff"
            iconBackground="#259dcc"
            onClick={() => calc("multiply")}
          />
          <Button
            text="Dividir"
            icon={<FiDivide />}
            type="submit"
            color="white"
            background="#8d38dd"
            iconBackground="#741ec4"
            onClick={() => calc("divide")}
          />
        </div>
      </form>
    </main>
  );
}

export default App;
