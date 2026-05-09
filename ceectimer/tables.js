async function loadTables() {
  gsat = await loadTable("assets/gsat.csv", ",", "header");
  ast = await loadTable("assets/ast.csv", ",", "header");
  
  // parse gsat data
  html = `<option disabled>--請選擇考科--</option>`;
  html += `<optgroup label="學科能力測驗">`;
  for (let row of gsat.getRows()) registerRow(row);
  html += `</optgroup>`;
  
  // parse ast data
  html += `<optgroup label="分科測驗">`;
  for (let row of ast.getRows()) registerRow(row);
  html += `</optgroup>`;
}


function registerRow(row) {
  let subject = row.getString("subject");
  html += "<option>";
  html += subject;
  html += "</option>";
  subjectNames.push(subject);
  timeSpans.push(new TimeSpan(row.getNum("shour"), row.getNum("smin"), row.getNum("ssec"), row.getNum("duration")));
}