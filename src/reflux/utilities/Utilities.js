// Utilities
export function cx(classNames) {
    var names = '';

    if (typeof classNames == 'object') {
        for (var name in classNames) {
            if (!classNames.hasOwnProperty(name) || !classNames[name]) {
                continue;
            }
            names += name + ' ';
        }
    } else {
        for (var i = 0; i < arguments.length; i++) {
            // We should technically exclude 0 too, but for the sake of backward
            // compat we'll keep it (for now)
            if (arguments[i] == null) {
                continue;
            }
            names += arguments[i] + ' ';
        }
    }

    return names.trim();
}