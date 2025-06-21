/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "./historico.module.css";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "./select";
import SortIcon from "./svgs/sort-icon";
import Pagination from "./pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { pt } from "date-fns/locale";

import { isMobile } from "@/utils";

type Option = { value: string; label: string };

const options: Option[] = [
  { value: "Tudo", label: "Tudo" },
  { value: "Aberto", label: "Aberto" },
  { value: "Em tratamento", label: "Em tratamento" },
  { value: "Aguarda Cliente", label: "Aguarda Cliente" },
  { value: "Aguarda Proposta", label: "Aguarda Proposta" },
  { value: "Fechado", label: "Fechado" },
];
const options2: Option[] = [
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "75", label: "75" },
];

export default function Historico(
  props: {
    assistencias: any;
  } = {
    assistencias: [],
  }
) {
  const router = useRouter();
  const searchInputDesktopRef = useRef<HTMLInputElement>(null);
  const searchInputMobileRef = useRef<HTMLInputElement>(null);
  const isMobileDevice = isMobile();

  function expirationDate() {
    return Date.now() + 1000 * 60 * 60;
  }
  function expired(key: string): boolean {
    const item = JSON.parse(localStorage.getItem(key) || "{}").expiration;
    return Date.now() > item;
  }
  [
    "autosave-historico-searchValue",
    "autosave-historico-searchValueNumero",
    "autosave-historico-dateValue",
    "autosave-historico-selectedStatus",
    "autosave-historico-selectedStatus2",
    "autosave-historico-sortDate",
    "autosave-historico-sortStatus",
    "autosave-historico-pagination",
  ].forEach((key) => {
    if (expired(key)) {
      localStorage.removeItem(key);
    }
  });
  const [searchValue, setSearchValue] = useState(
    JSON.parse(localStorage.getItem("autosave-historico-searchValue") || "{}")
      .searchValue || ""
  );
  const [searchValueNumero, setSearchValueNumero] = useState(
    JSON.parse(
      localStorage.getItem("autosave-historico-searchValueNumero") || "{}"
    ).searchValueNumero || ""
  );

  const [filteredAssistencias, setFilteredAssistencias] = useState<any[]>(
    props.assistencias
  );
  const [selectedStatus, setSelectedStatus] = useState(
    JSON.parse(
      localStorage.getItem("autosave-historico-selectedStatus") || "{}"
    ).selectedStatus || options[0]
  );
  const [selectedStatus2, setSelectedStatus2] = useState(
    JSON.parse(
      localStorage.getItem("autosave-historico-selectedStatus2") || "{}"
    ).selectedStatus2 || options2[0]
  );
  const [sortDate, setSortDate] = useState(
    JSON.parse(localStorage.getItem("autosave-historico-sortDate") || "{}")
      .sortDate || false
  );
  const [sortStatus, setSortStatus] = useState(
    JSON.parse(localStorage.getItem("autosave-historico-sortStatus") || "{}")
      .sortStatus || false
  );
  const [pagination, setPagination] = useState(
    JSON.parse(localStorage.getItem("autosave-historico-pagination") || "{}")
      .pagination || 1
  );
  const storedDateValue = JSON.parse(
    localStorage.getItem("autosave-historico-dateValue") || "{}"
  );
  const initialStartDate = storedDateValue.startDate
    ? new Date(storedDateValue.startDate)
    : null;
  const initialEndDate = storedDateValue.endDate
    ? new Date(storedDateValue.endDate)
    : null;

  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    initialStartDate,
    initialEndDate,
  ]);

  useEffect(() => {
    localStorage.setItem(
      "autosave-historico-searchValue",
      JSON.stringify({ searchValue, expiration: expirationDate() })
    );
  }, [searchValue]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-historico-searchValueNumero",
      JSON.stringify({ searchValueNumero, expiration: expirationDate() })
    );
  }, [searchValueNumero]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-historico-dateValue",
      JSON.stringify({
        startDate: startDate,
        endDate: endDate,
        expiration: expirationDate(),
      })
    );
  }, [startDate, endDate, dateRange]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-historico-selectedStatus",
      JSON.stringify({ selectedStatus, expiration: expirationDate() })
    );
  }, [selectedStatus]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-historico-selectedStatus2",
      JSON.stringify({ selectedStatus2, expiration: expirationDate() })
    );
  }, [selectedStatus2]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-historico-sortDate",
      JSON.stringify({ sortDate, expiration: expirationDate() })
    );
  }, [sortDate]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-historico-sortStatus",
      JSON.stringify({ sortStatus, expiration: expirationDate() })
    );
  }, [sortStatus]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-historico-pagination",
      JSON.stringify({ pagination, expiration: expirationDate() })
    );
  }, [pagination]);

  useEffect(() => {
    if (
      searchValue !== "" ||
      (startDate !== null && endDate !== null) ||
      selectedStatus ||
      searchValueNumero !== "" ||
      sortDate ||
      sortStatus
    ) {
      const filtered = props.assistencias.filter((assistencia: any) => {
        let searchMatch;
        let searchMatchNumero;

        if (isMobileDevice) {
          searchMatch =
            assistencia.problema
              .toLowerCase()
              .startsWith(searchValue.toLowerCase()) ||
            assistencia.nopat.toString().startsWith(searchValue);
          searchMatchNumero = true;
        } else {
          searchMatch = assistencia.problema
            .toLowerCase()
            .startsWith(searchValue.toLowerCase());
          searchMatchNumero = assistencia.nopat
            .toString()
            .startsWith(searchValueNumero);
        }

        let dateMatch = true;
        if (startDate !== null && endDate !== null) {
          const data = new Date(assistencia.pdata);
          const dataTime = new Date(
            data.getFullYear(),
            data.getMonth(),
            data.getDate()
          ).getTime();
          const startTime = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          ).getTime();
          const endTime = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
          ).getTime();
          dateMatch = dataTime >= startTime && dataTime <= endTime;
        }
        const statusMatch =
          selectedStatus?.value === "Tudo"
            ? true
            : assistencia.status === selectedStatus?.value ||
              selectedStatus === null;

        return searchMatch && dateMatch && statusMatch && searchMatchNumero;
      });
      const sorted = [...filtered].sort((a, b) => {
        if (sortDate) {
          const dateDiff =
            new Date(a.pdata).getTime() - new Date(b.pdata).getTime();
          if (dateDiff !== 0) return dateDiff;
        }
        if (sortStatus) {
          return a.status.localeCompare(b.status);
        }
        return 0;
      });
      setFilteredAssistencias(sorted);
    } else {
      setFilteredAssistencias(props.assistencias);
    }
  }, [
    searchValue,
    startDate,
    endDate,
    selectedStatus,
    searchValueNumero,
    sortDate,
    sortStatus,
    props.assistencias,
  ]);
  useEffect(() => {
    setStartDate(dateRange[0]);
    setEndDate(dateRange[1]);
  }, [dateRange]);

  const pageSize = parseInt(selectedStatus2?.value ?? "25", 10);
  const currentPageItems = filteredAssistencias.slice(
    pageSize * (pagination - 1),
    pageSize * pagination
  );
  const emptyRows = pageSize - currentPageItems.length;
  function scrollToTopAdaptive(
    desktopRef: React.RefObject<HTMLInputElement | null>,
    mobileRef: React.RefObject<HTMLInputElement | null>,
    callback: () => void,
    desktopOffset = 80,
    mobileOffset = 150,
    delay = 300
  ) {
    const input = isMobileDevice ? mobileRef.current : desktopRef.current;
    const offset = isMobileDevice ? mobileOffset : desktopOffset;

    if (input && input.offsetParent !== null) {
      const y = input.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setTimeout(callback, delay);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(callback, delay);
    }
  }
  return (
    <div className={styles.historico}>
      <div className={`${styles.gridHeader} ${styles.desktopOnly}`}>
        <div className={styles.headerSearchRow}>
          <label className={styles.headerLabel}>Pedido sobre</label>
          <div className={styles.searchContainer} style={{ width: "222px" }}>
            <img
              src="/lupa.svg"
              alt="Lupa"
              width={16}
              height={16}
              className={styles.searchContainerImage}
            />
            <input
              ref={searchInputDesktopRef}
              id="searchInput"
              autoComplete="off"
              autoCorrect="off"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
              onFocus={() =>
                scrollToTopAdaptive(
                  searchInputDesktopRef,
                  searchInputMobileRef,
                  () => {},
                  50,
                  150,
                  0
                )
              }
            />
          </div>
        </div>
        <div className={styles.headerFilter}>
          <div className={styles.headerTittle}>
            <label className={styles.headerLabel}>Data do pedido</label>
            <div className={styles.sortContainer}>
              <button onClick={() => setSortDate(!sortDate)}>
                <SortIcon down={sortDate} />
              </button>
            </div>
          </div>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null] | null) =>
              setDateRange(update as [Date | null, Date | null])
            }
            dateFormat="dd-MM-yyyy"
            className={styles.dateInput}
            popperClassName={styles.datePickerPopper}
            isClearable={true}
            placeholderText="Data do pedido"
            locale={pt}
            onFocus={() =>
              scrollToTopAdaptive(
                searchInputDesktopRef,
                searchInputMobileRef,
                () => {},
                50,
                150,
                0
              )
            }
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  className={styles.botoes}
                  aria-label="Mês anterior"
                >
                  {/* Chevron esquerda */}
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                    <polyline
                      points="17,7 11,14 17,21"
                      stroke="#01ACED"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <select
                  value={date.getMonth()}
                  onChange={({ target: { value } }) =>
                    changeMonth(Number(value))
                  }
                  className={styles.meses}
                >
                  {[
                    "janeiro",
                    "fevereiro",
                    "março",
                    "abril",
                    "maio",
                    "junho",
                    "julho",
                    "agosto",
                    "setembro",
                    "outubro",
                    "novembro",
                    "dezembro",
                  ].map((month, idx) => (
                    <option key={month} value={idx}>
                      {month.charAt(0).toUpperCase() + month.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) =>
                    changeYear(Number(value))
                  }
                  className={styles.ano}
                >
                  {Array.from({ length: 50 }, (_, i) => 1980 + i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  className={styles.botoes}
                  aria-label="Próximo mês"
                >
                  {/* Chevron direita */}
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                    <polyline
                      points="11,7 17,14 11,21"
                      stroke="#01ACED"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          />
        </div>
        <div className={styles.headerFilter}>
          <div className={styles.headerTittle}>
            <label className={styles.headerLabel}>Estado</label>
            <div className={styles.sortContainer}>
              <button onClick={() => setSortStatus(!sortStatus)}>
                <SortIcon down={sortStatus} />
              </button>
            </div>
          </div>
          <div className={styles.selectContainer}>
            <Select
              options={options}
              value={selectedStatus}
              onChange={(option) => setSelectedStatus(option)}
              placeholder="Tudo"
            />
          </div>
        </div>
        <div className={styles.headerSearchRow}>
          <label className={styles.headerLabel}>Número do pedido</label>
          <div className={styles.searchContainer} style={{ width: "148px" }}>
            <img
              src="/lupa.svg"
              alt="Lupa"
              width={16}
              height={16}
              className={styles.searchContainerImage}
            />
            <input
              id="searchInputNumero"
              autoComplete="off"
              autoCorrect="off"
              type="text"
              value={searchValueNumero}
              onChange={(e) => setSearchValueNumero(e.target.value)}
              className={styles.searchInput}
              onFocus={() =>
                scrollToTopAdaptive(
                  searchInputDesktopRef,
                  searchInputMobileRef,
                  () => {},
                  50,
                  150,
                  0
                )
              }
            />
          </div>
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className={`${styles.gridHeader} ${styles.mobileOnly}`}>
        <div className={styles.headerSearchRow}>
          <label className={styles.headerLabel}>
            Pedido sobre / nº do pedido
          </label>
          <div className={styles.searchContainer}>
            <img
              src="/lupa.svg"
              alt="Lupa"
              width={16}
              height={16}
              className={styles.searchContainerImage}
            />
            <input
              ref={searchInputMobileRef}
              id="searchInput"
              autoComplete="off"
              autoCorrect="off"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
              onFocus={() =>
                scrollToTopAdaptive(
                  searchInputDesktopRef,
                  searchInputMobileRef,
                  () => {},
                  50,
                  150,
                  0
                )
              }
            />
          </div>
        </div>
        <div className={styles.headerFiltersRow}>
          <div className={styles.headerFilter}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "space-between",
                width: "100%",
                height: "16px",
              }}
            >
              <label className={styles.headerLabel}>Data do pedido</label>
              <div className={styles.sortContainer}>
                <button onClick={() => setSortDate(!sortDate)}>
                  <SortIcon down={sortDate} />
                </button>
              </div>
            </div>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update: [Date | null, Date | null] | null) =>
                setDateRange(update as [Date | null, Date | null])
              }
              dateFormat="dd-MM-yyyy"
              className={styles.dateInput}
              popperClassName={styles.datePickerPopper}
              isClearable={true}
              placeholderText="Data do pedido"
              locale={pt}
              onFocus={() =>
                scrollToTopAdaptive(
                  searchInputDesktopRef,
                  searchInputMobileRef,
                  () => {},
                  50,
                  150,
                  0
                )
              }
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className={styles.botoes}
                    aria-label="Mês anterior"
                  >
                    {/* Chevron esquerda */}
                    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                      <polyline
                        points="17,7 11,14 17,21"
                        stroke="#01ACED"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <select
                    value={date.getMonth()}
                    onChange={({ target: { value } }) =>
                      changeMonth(Number(value))
                    }
                    className={styles.meses}
                  >
                    {[
                      "janeiro",
                      "fevereiro",
                      "março",
                      "abril",
                      "maio",
                      "junho",
                      "julho",
                      "agosto",
                      "setembro",
                      "outubro",
                      "novembro",
                      "dezembro",
                    ].map((month, idx) => (
                      <option key={month} value={idx}>
                        {month.charAt(0).toUpperCase() + month.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={date.getFullYear()}
                    onChange={({ target: { value } }) =>
                      changeYear(Number(value))
                    }
                    className={styles.ano}
                  >
                    {Array.from({ length: 50 }, (_, i) => 1980 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className={styles.botoes}
                    aria-label="Próximo mês"
                  >
                    {/* Chevron direita */}
                    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                      <polyline
                        points="11,7 17,14 11,21"
                        stroke="#01ACED"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            />
          </div>
          <div className={styles.headerFilter}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "space-between",
                width: "100%",
                height: "16px",
              }}
            >
              <label className={styles.headerLabel}>Estado</label>
              <div className={styles.sortContainer}>
                <button onClick={() => setSortStatus(!sortStatus)}>
                  <SortIcon down={sortStatus} />
                </button>
              </div>
            </div>
            <div className={styles.selectContainer}>
              <Select
                options={options}
                value={selectedStatus}
                onChange={(option) => setSelectedStatus(option)}
                placeholder="Tudo"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP BODY */}
      <div className={`${styles.gridBody} ${styles.desktopOnly}`}>
        {currentPageItems.map((assistencia: any, index: number) => (
          <div key={index} className={styles.gridRow}>
            <div className={styles.cell}>{assistencia.problema}</div>
            <div className={styles.cell}>
              {new Date(assistencia.pdata).toLocaleDateString("pt-PT")}
            </div>
            <div className={styles.cell}>{assistencia.status}</div>
            <div className={styles.cell}>{assistencia.nopat}</div>
            <div className={styles.notificationContainer}>
              <button
                className={
                  assistencia.status === "Aberto" ||
                  assistencia.status === "Em Desenvolvimento" ||
                  assistencia.status === "Aguarda Cliente"
                    ? styles.notificationButton
                    : `${styles.notificationButton} ${styles.notificationButtonVer}`
                }
                onClick={() => {
                  router.push(`/ver_assistencias/${assistencia.nopat}`);
                }}
              >
                {assistencia.status === "Aberto" ||
                assistencia.status === "Em Desenvolvimento" ||
                assistencia.status === "Aguarda Cliente"
                  ? "Ler/Responder"
                  : "Ver"}
              </button>
            </div>
          </div>
        ))}
        {Array.from({ length: emptyRows }).map((_, idx) => (
          <div key={`empty-desktop-${idx}`} style={{ height: "55px" }}></div>
        ))}
      </div>

      {/* MOBILE BODY */}
      <div className={`${styles.gridBody} ${styles.mobileOnly}`}>
        {currentPageItems.map((assistencia: any, index: number) => (
          <div key={index} className={styles.gridRow}>
            <div className={`${styles.cell} ${styles.pedidoSobre}`}>
              <span>{assistencia.problema}</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoCell}>
                <label>Data do pedido</label>
                <span>
                  {new Date(assistencia.pdata).toLocaleDateString("pt-PT")}
                </span>
              </div>
              <div className={styles.infoCell}>
                <label>Nº do pedido</label>
                <span>{assistencia.nopat}</span>
              </div>
              <div className={styles.infoCell}>
                <label>Estado</label>
                <span>{assistencia.status}</span>
              </div>
            </div>
            <div className={styles.notificationContainer}>
              <button
                className={
                  assistencia.status === "Aberto" ||
                  assistencia.status === "Em Desenvolvimento" ||
                  assistencia.status === "Aguarda Cliente"
                    ? styles.notificationButton
                    : `${styles.notificationButton} ${styles.notificationButtonVer}`
                }
                onClick={() => {
                  const assistenciaData = {
                    sobre: assistencia.problema,
                    data: new Date(assistencia.pdata),
                    estado: assistencia.status,
                    numero: assistencia.nopat,
                    isOpen: !assistencia.fechado,
                  };
                  localStorage.setItem(
                    "assistencia",
                    JSON.stringify(assistenciaData)
                  );
                  router.push(`/ver_assistencias/${assistencia.nopat}`);
                }}
              >
                {assistencia.status === "Aberto" ||
                assistencia.status === "Em Desenvolvimento" ||
                assistencia.status === "Aguarda Cliente"
                  ? "Ler/Responder"
                  : "Ver"}
              </button>
            </div>
          </div>
        ))}
        {Array.from({ length: emptyRows }).map((_, idx) => (
          <div
            key={`empty-mobile-${idx}`}
            style={{
              height: "178px",
              marginTop: "24px",
              paddingBottom: "24px",
            }}
          >
            <div className={styles.cell} />
          </div>
        ))}
      </div>

      <div
        className={`${styles.pedidosVistos} ${
          Math.ceil(
            filteredAssistencias.length /
              parseInt(selectedStatus2?.value ?? "25")
          ) === pagination
            ? styles.showPedidosVistos
            : ""
        }`}
      >
        <img src="/certo.svg" alt="Certo resolvido" width={16} height={16} />
        <h1>Chegou ao fim da lista</h1>
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.countContainer}>
          <h6>{`${filteredAssistencias.length} resultados`}</h6>
          <Select
            options={options2}
            value={selectedStatus2}
            onChange={(option) => {
              setSelectedStatus2(option);
              setPagination(1);
            }}
            placeholder="Tudo"
            num={2}
          />
        </div>
        <div className={styles.pagination}>
          <Pagination
            pagination={pagination}
            setPagination={setPagination}
            length={filteredAssistencias.length}
            selectedStatus2={selectedStatus2 ?? { value: "25" }}
          />
        </div>
        <button
          className={styles.goTop}
          onClick={() => {
            const mobileInput = searchInputMobileRef.current;
            const desktopInput = searchInputDesktopRef.current;
            if (mobileInput && mobileInput.offsetParent !== null) {
              const y =
                mobileInput.getBoundingClientRect().top + window.scrollY - 150;
              window.scrollTo({ top: y, behavior: "smooth" });
            } else if (desktopInput && desktopInput.offsetParent !== null) {
              const y =
                desktopInput.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }}
        >
          Ir para o topo
          <img src="/arrowUp.svg" alt="Topo" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
