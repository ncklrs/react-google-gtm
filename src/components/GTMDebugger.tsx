// src/components/GTMDebugger.tsx
import React, { useState, useEffect } from "react";
import { useGTM } from "../hooks/useGTM";
import { GTMEvent } from "../sendGTMEvent";

export interface GTMDebuggerProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  maxEvents?: number;
  showTimestamp?: boolean;
}

/**
 * Visual debugger component for GTM events
 * Shows recent events, GTM status, and dataLayer contents
 *
 * @example
 * ```tsx
 * {process.env.NODE_ENV === 'development' && (
 *   <GTMDebugger position="bottom-right" maxEvents={10} />
 * )}
 * ```
 */
export const GTMDebugger: React.FC<GTMDebuggerProps> = ({
  position = "bottom-right",
  maxEvents = 20,
  showTimestamp = true,
}) => {
  const { isReady, gtmId, getDataLayer } = useGTM();
  const [events, setEvents] = useState<Array<GTMEvent & { timestamp: number }>>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDataLayer, setShowDataLayer] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Intercept dataLayer.push
    const originalDataLayer = window.dataLayer || [];
    const originalPush = originalDataLayer.push.bind(originalDataLayer);

    window.dataLayer.push = function (...items: any[]) {
      items.forEach((item) => {
        if (item.event) {
          setEvents((prev) => [
            { ...item, timestamp: Date.now() },
            ...prev.slice(0, maxEvents - 1),
          ]);
        }
      });
      return originalPush(...items);
    };

    return () => {
      if (window.dataLayer) {
        window.dataLayer.push = originalPush;
      }
    };
  }, [maxEvents]);

  const positionStyles: Record<string, React.CSSProperties> = {
    "bottom-right": { bottom: 20, right: 20 },
    "bottom-left": { bottom: 20, left: 20 },
    "top-right": { top: 20, right: 20 },
    "top-left": { top: 20, left: 20 },
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      position: "fixed",
      ...positionStyles[position],
      width: 400,
      maxHeight: 600,
      backgroundColor: "#1a1a1a",
      color: "#fff",
      borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      fontFamily: "monospace",
      fontSize: 12,
      zIndex: 999999,
      overflow: "hidden",
    },
    header: {
      padding: "12px 16px",
      backgroundColor: "#2a2a2a",
      borderBottom: "1px solid #3a3a3a",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
    },
    title: {
      margin: 0,
      fontSize: 14,
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    status: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: isReady ? "#4caf50" : "#ff9800",
    },
    button: {
      backgroundColor: "transparent",
      border: "1px solid #4a4a4a",
      color: "#fff",
      padding: "4px 8px",
      borderRadius: 4,
      cursor: "pointer",
      fontSize: 11,
      marginLeft: 8,
    },
    content: {
      maxHeight: 500,
      overflowY: "auto" as const,
      padding: 0,
    },
    tabs: {
      display: "flex",
      borderBottom: "1px solid #3a3a3a",
      backgroundColor: "#2a2a2a",
    },
    tab: {
      flex: 1,
      padding: "8px 16px",
      backgroundColor: "transparent",
      border: "none",
      color: "#999",
      cursor: "pointer",
      fontSize: 12,
    },
    activeTab: {
      color: "#fff",
      borderBottom: "2px solid #4caf50",
    },
    eventList: {
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    eventItem: {
      padding: "12px 16px",
      borderBottom: "1px solid #2a2a2a",
    },
    eventName: {
      color: "#4caf50",
      fontWeight: "bold",
      marginBottom: 4,
    },
    timestamp: {
      color: "#666",
      fontSize: 10,
      marginBottom: 4,
    },
    eventData: {
      color: "#ddd",
      fontSize: 11,
      whiteSpace: "pre-wrap" as const,
      wordBreak: "break-word" as const,
    },
    empty: {
      padding: 32,
      textAlign: "center" as const,
      color: "#666",
    },
  };

  if (!isExpanded) {
    return (
      <div style={{ ...styles.container, width: "auto" }}>
        <div style={styles.header} onClick={() => setIsExpanded(true)}>
          <h3 style={styles.title}>
            <span style={styles.status} />
            GTM Debug
          </h3>
          <span style={{ fontSize: 10, color: "#666" }}>
            {events.length} events
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(false)}>
        <h3 style={styles.title}>
          <span style={styles.status} />
          GTM Debugger
        </h3>
        <div>
          <button style={styles.button} onClick={(e) => { e.stopPropagation(); setEvents([]); }}>
            Clear
          </button>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(showDataLayer ? {} : styles.activeTab),
          }}
          onClick={() => setShowDataLayer(false)}
        >
          Events ({events.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(showDataLayer ? styles.activeTab : {}),
          }}
          onClick={() => setShowDataLayer(true)}
        >
          DataLayer
        </button>
      </div>

      <div style={styles.content}>
        {!showDataLayer ? (
          events.length === 0 ? (
            <div style={styles.empty}>No events yet</div>
          ) : (
            <ul style={styles.eventList}>
              {events.map((event, index) => (
                <li key={index} style={styles.eventItem}>
                  <div style={styles.eventName}>{event.event}</div>
                  {showTimestamp && (
                    <div style={styles.timestamp}>{formatTime(event.timestamp)}</div>
                  )}
                  <div style={styles.eventData}>
                    {JSON.stringify(
                      Object.fromEntries(
                        Object.entries(event).filter(
                          ([key]) => key !== "event" && key !== "timestamp"
                        )
                      ),
                      null,
                      2
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : (
          <div style={{ padding: 16 }}>
            <div style={{ ...styles.eventData, fontSize: 10 }}>
              <strong>GTM ID:</strong> {gtmId}
              <br />
              <strong>Status:</strong> {isReady ? "Ready" : "Loading"}
              <br />
              <br />
              <strong>DataLayer Contents:</strong>
              <pre style={{ margin: 0, marginTop: 8 }}>
                {JSON.stringify(getDataLayer(), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
