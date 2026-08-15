-- Run once on your DB (MySQL/InnoDB)
-- Creates pivot tables for multi-select fields in personaldataregister.

CREATE TABLE IF NOT EXISTS personaldataregister_specialprograms (
  personalData_id INT NOT NULL,
  specialPrograms_id INT NOT NULL,
  PRIMARY KEY (personalData_id, specialPrograms_id),
  INDEX idx_pdsp_sp (specialPrograms_id),
  CONSTRAINT fk_pdsp_pd
    FOREIGN KEY (personalData_id) REFERENCES personaldataregister(personalData_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pdsp_sp
    FOREIGN KEY (specialPrograms_id) REFERENCES specialprograms(specialPrograms_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS personaldataregister_areasattention (
  personalData_id INT NOT NULL,
  areasAttention_id INT NOT NULL,
  PRIMARY KEY (personalData_id, areasAttention_id),
  INDEX idx_pdaa_area (areasAttention_id),
  CONSTRAINT fk_pdaa_pd
    FOREIGN KEY (personalData_id) REFERENCES personaldataregister(personalData_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pdaa_area
    FOREIGN KEY (areasAttention_id) REFERENCES areasattention(areasattention_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS personaldataregister_badhabits (
  personalData_id INT NOT NULL,
  badHabits_id INT NOT NULL,
  PRIMARY KEY (personalData_id, badHabits_id),
  INDEX idx_pdbh_bad (badHabits_id),
  CONSTRAINT fk_pdbh_pd
    FOREIGN KEY (personalData_id) REFERENCES personaldataregister(personalData_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pdbh_bad
    FOREIGN KEY (badHabits_id) REFERENCES badhabits(badHabits_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS personaldataregister_specialevents (
  personalData_id INT NOT NULL,
  specialEvent_id INT NOT NULL,
  specialEvent_date DATE NULL,
  PRIMARY KEY (personalData_id, specialEvent_id),
  INDEX idx_pdse_event (specialEvent_id),
  CONSTRAINT fk_pdse_pd
    FOREIGN KEY (personalData_id) REFERENCES personaldataregister(personalData_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pdse_event
    FOREIGN KEY (specialEvent_id) REFERENCES specialevent(specialevent_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

