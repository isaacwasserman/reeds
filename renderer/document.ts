import exp from "constants";

function generateUUID() {
  let time = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    time += performance.now();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let random = (time + Math.random() * 16) % 16 | 0;
    time = Math.floor(time / 16);
    return (c === "x" ? random : (random & 0x3) | 0x8).toString(16);
  });
}

class BibtexEntry {
  ENTRYTYPE: string;
  abstract?: string;
  addendum?: string;
  address?: string;
  afterword?: string;
  annotation?: string;
  annotator?: string;
  annote?: string;
  author?: string;
  bookauthor?: string;
  booktitle?: string;
  bookpagination?: string;
  chapter?: string;
  commentator?: string;
  crossref?: string;
  date?: string;
  doi?: string;
  edition?: string;
  editor?: string;
  editora?: string;
  editorb?: string;
  editorc?: string;
  eid?: string;
  email?: string;
  entryset?: string;
  entrysubtype?: string;
  eprint?: string;
  eprinttype?: string;
  eventdate?: string;
  eventtitle?: string;
  execute?: string;
  file?: string;
  forward?: string;
  gender?: string;
  holder?: string;
  howpublished?: string;
  ids?: string;
  indexsorttitle?: string;
  indextitle?: string;
  institution?: string;
  introduction?: string;
  isan?: string;
  isbn?: string;
  ismn?: string;
  isrn?: string;
  issn?: string;
  iswc?: string;
  issuetitle?: string;
  journal?: string;
  journaltitle?: string;
  keywords?: string;
  label?: string;
  langid?: string;
  langidopts?: string;
  language?: string;
  library?: string;
  location?: string;
  maintitle?: string;
  month?: string;
  note?: string;
  number?: string;
  options?: string;
  organization?: string;
  pages?: string;
  pagetotal?: string;
  pagination?: string;
  part?: string;
  presort?: string;
  publisher?: string;
  pubstate?: string;
  related?: string;
  relatedtype?: string;
  relatedstring?: string;
  reprinttitle?: string;
  school?: string;
  shorthand?: string;
  shorthandintro?: string;
  series?: string;
  sortkey?: string;
  sortname?: string;
  sortshorthand?: string;
  sorttitle?: string;
  sortyear?: string;
  title?: string;
  translator?: string;
  type?: string;
  url?: string;
  urldate?: string;
  version?: string;
  venue?: string;
  volume?: string;
  volumes?: string;
  xref?: string;
  xdata?: string;
  year?: string;

  constructor() {
    this.referenceType = "misc";
  }
}

class ReedsDocument {
  id: string;
  addedDate: number;
  bibtex: BibtexEntry;

  constructor() {
    this.id = generateUUID();
    this.addedDate = Date.now();
    this.bibtex = new BibtexEntry();
  }

  from_json(json: any) {
    let document = new ReedsDocument();
    document.id = json.id;
    document.addedDate = json.addedDate;
    document.bibtex = json.bibtex;
    return document;
  }

  to_json() {
    return {
      id: this.id,
      addedDate: this.addedDate,
      bibtex: this.bibtex,
    };
  }

  get(key: string): any {
    if (key === "addedDate") {
      return this.addedDate;
    } else if (key === "id") {
      return this.id;
    } else {
      return this.bibtex[key];
    }
  }
}

function formatAuthor(value: string): string {
  let authors = value.split(" and ");
  let split_authors = authors.map((author) => {
    let names = author.split(", ");
    return [names[1], names[0]];
  });
  if (split_authors.length === 1) {
    return authors[0];
  } else if (split_authors.length === 2) {
    return `${split_authors[0][1]} and ${split_authors[1][1]}`;
  } else {
    return `${split_authors[0][1]} et al.`;
  }
}

function formatAddedDate(value: number): string {
  let date = new Date(1970, 0, 1);
  date.setSeconds(value);
  let dateString = date.toLocaleDateString();
  // Create time string without seconds but with AM/PM
  let timeString = date.toLocaleTimeString().replace(/:\d+ /, " ");
  dateString = `${dateString} ${timeString}`;
  return dateString;
}

function formatField(field: string, value: string): string {
  let formattedValue = value;
  try {
    switch (field) {
      case "author":
        formattedValue = formatAuthor(value);
        break;
      case "addedDate":
        formattedValue = formatAddedDate(value);
        break;
    }
  } catch (error) {
    console.error(
      `Error formatting field ${field} with value ${value}: ${error}`
    );
  }
  return formattedValue;
}

export { ReedsDocument, BibtexEntry, formatField };
