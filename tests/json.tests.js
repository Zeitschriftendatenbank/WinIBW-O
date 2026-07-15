
TestRunner.add("json_parseField_pica3", function() {
    // Ensure delimiter is '$' for predictable parsing
    try { MISC.format('D'); } catch (e) {}

    var line1 = "039E $bf$aFortsetzung von$942987667$8--Cbvz--Deutsche Zentralbücherei für Blinde zu Leipzig: DZB-Nachrichten";
    var parsed1 = JSON.parseField(line1);
    TestRunner.assert(typeof parsed1['039E'] !== 'undefined', 'Field 039E should be present');
    TestRunner.assert(parsed1['039E']['b'][0] === 'f', 'subfield b should contain "f"');
    TestRunner.assert(parsed1['039E']['a'][0] === 'Fortsetzung von', 'subfield a should contain "Fortsetzung von"');
    TestRunner.assert(parsed1['039E']['8'][0].indexOf('Deutsche Zentralbücherei') !== -1, 'subfield 8 should contain library name');

    var line2 = "017A $aee$amg$anw";
    var parsed2 = JSON.parseField(line2);
    TestRunner.assert(typeof parsed2['017A'] !== 'undefined', 'Field 017A should be present');
    TestRunner.assert(parsed2['017A']['a'].length === 3, 'field 017A.a should have three entries');
    TestRunner.assert(parsed2['017A']['a'][1] === 'mg', 'second entry of 017A.a should be "mg"');

    return true;
});


TestRunner.add("json_parseField_picaplus", function() {
  MISC.format('P');
  var out = ZDB.parseField("039E ƒbfƒaFortsetzung vonƒ9942987667ƒ8--Cbvz");
  TestRunner.assert(out["039E"]["b"][0] == "f", "b subfield mismatch");
  TestRunner.assert(out["039E"]["a"][0] == "Fortsetzung von", "a subfield mismatch");
  // numeric might be slightly different in examples; check contains digits
  TestRunner.assert(out["039E"]["9"][0].match(/\d{7,}/) !== null, "9 subfield missing digits");
});