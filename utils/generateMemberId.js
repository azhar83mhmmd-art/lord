/* Generates a random (non-sequential) 4-digit member code, e.g. FP-7241.
   Takes the list of existing members so it can retry on collision -
   collisions are rare (1 in 9000) but must never produce a duplicate ID. */
function generateMemberId(existingMembers = []) {
  const usedIds = new Set(existingMembers.map(m => m.memberId));

  let candidate;
  do {
    const num = Math.floor(1000 + Math.random() * 9000); // 1000-9999
    candidate = `FP-${num}`;
  } while (usedIds.has(candidate));

  return candidate;
}

module.exports = generateMemberId;
