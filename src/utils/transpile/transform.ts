import { Transform, transform as _transform } from 'sucrase'

const opts = { transforms: ['jsx', 'imports'] as Transform[] }

export default (code: string) => _transform(code, opts).code
