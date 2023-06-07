export function stringifyAnyFactory({ indent = '  ', width = 120 }: { indent?: string; width?: number } = {}) {
  const indentCache: string[] = [];

  function makeIndent(count: number): string {
    if (indentCache[count]) return indentCache[count];
    const indentString = new Array(count).fill(indent).join('');
    indentCache[count] = indentString;
    return indentString;
  }

  function stringifyAny(obj: unknown, indent = 0, ancestors: any[] = []): string {
    const typeofObj = typeof obj;
    if (obj === null) return 'null';
    else if (typeofObj === 'object') {
      ancestors[indent] = obj;
      const indentStr = makeIndent(indent);
      const subIndentStr = makeIndent(indent + 1);
      if (Array.isArray(obj)) {
        const l = obj.length;
        if (l === 0) return '[]';
        let stringLengthSum = 0;
        const chunks = new Array(l);
        const subIndent = indent + 1;
        for (let i = 0; i < l; i++) {
          const value = obj[i];
          const chunk = ancestors.includes(value) ? '[Circular]' : stringifyAny(value, subIndent, ancestors);
          stringLengthSum += chunk.length;
          chunks[i] = chunk;
        }
        const totalStringLength = 4 + stringLengthSum + (l - 1) * 2;
        return totalStringLength > width
          ? `[\n${chunks.map((str) => subIndentStr + str).join(',\n')}\n${indentStr}]`
          : `[ ${chunks.join(', ')} ]`;
      } else {
        const keyValues = Object.entries(obj as Record<string, any>);
        const l = keyValues.length;
        if (l === 0) return '{}';
        let stringLengthSum = 0;
        const chunks = new Array(l);
        const subIndent = indent + 2;
        for (let i = 0; i < l; i++) {
          const value = keyValues[i][1];
          const chunk = ancestors.includes(value) ? '[Circular]' : `${keyValues[i][0]}: ${stringifyAny(value, subIndent, ancestors)}`;
          stringLengthSum += chunk.length;
          chunks[i] = chunk;
        }
        const totalStringLength = 4 + stringLengthSum + (l - 1) * 2;
        return totalStringLength > width
          ? `{\n${chunks.map((str) => subIndentStr + str).join(',\n')}\n${indentStr}}`
          : `{ ${chunks.join(', ')} }`;
      }
    } else if (typeofObj === 'bigint' || typeofObj === 'number' || typeofObj === 'boolean') {
      return (obj as bigint | number | boolean).toString();
    } else if (typeofObj === 'string') {
      return `'${(obj as string).length > width ? (obj as string).slice(0, width - 5) + '[...]' : (obj as string)}'`;
    } else if (typeofObj === 'symbol') {
      return (obj as symbol).toString();
    } else if (typeofObj === 'function') {
      return `Function(${(obj as () => any).name})`;
    } else {
      return 'undefined';
    }
  }
  return stringifyAny;
}
