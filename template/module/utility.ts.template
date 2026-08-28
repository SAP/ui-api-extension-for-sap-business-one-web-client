class Assert {
    static equal(actual: any, expected: any, message: string): void {
        console.assert(actual == expected, message);
        if (actual != expected) {
            const details = `actual is '${actual}', expected should be '${expected}'`;
            throw new Error(message + "\n" + details);
        }
    }
    static notEqual(actual: any, expected: any, message: string): void {
        console.assert(actual != expected, message);
        if (actual == expected) {
            const details = `actual is '${actual}', expected should not be '${expected}'`;
            throw new Error(message + "\n" + details);
        }
    }
}

function StringJoin(arr: any[], sep: string): string {
    return arr.join(sep);
}

export { StringJoin, Assert };