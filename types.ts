
export interface PatientRecord {
  RowID: string;
  FECHA: string;
  NOMBRE: string;
  EDAD: number;
  SEXO: 'Masculino' | 'Femenino' | 'Otro';
  REGISTRO: string;
  DIAGNOSTICO: string;
  FACTOR_DE_RIESGO: string;
  PROCEDENCIA: string;
  MEDICO_ENCARGADO: string;
  GENEXPERT_LAVADO: string;
  CULTIVO_TBC: string;
  MICOLOGICO_LAVADO: string;
  NO_BAAR_LAVADO: string;
  GENEXPERT_ESPUTO: string;
  CULTIVO_NO_BAAR_ESPUTO: string;
  BIOPSIA: 'Sí' | 'No';
  RESULTADO_BIOPSIA: string;
  OBSERVACION: string;
  DESTINO_PACIENTE: string;
  NUMERO_BIOPSIA: string;
  DATO_ADICIONAL_1: string;
  DATO_ADICIONAL_2: string;
}

export type NewPatientRecord = Omit<PatientRecord, 'RowID'>;

export type SortKey = keyof PatientRecord;
export type SortDirection = 'ascending' | 'descending';