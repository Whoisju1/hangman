type TransformTemplate<T> = (
  html: TemplateStringsArray,
  ...templateContent: string[] | number[] | Array<(data: T) => (string | number)>
) => DocumentFragment;

type ICreateFragment = <T>(data: T) => TransformTemplate<T>;

/**
 * @description This function is takes an object as the first element and returns a tag function.
 * The the object passed in as the initial parameter is accessible through the paramter of any function passed
 * in as an interpolated value in the template
 * @param {object} data - The values of the properties of this object is accessible in the paramter of any
 * function passed in as an interpolated value in the template literal
 * @returns {Function} - this is a tag function
 */
export const createFragment: ICreateFragment = (data) => {
  return (html, ...templateContent) => {
    // create empty fragment
    const fragment = document.createDocumentFragment();
    // create empty template
    const template = document.createElement('template');
    // assemble string from template literal string
    const content = html.reduce((previous, current, index) => {
      let addedContent = templateContent[index];
      // assign adddContent value according to value type
      switch (typeof addedContent) {
        case 'string':
          addedContent = addedContent.length ? addedContent : '';
          break;
        case 'function':
          addedContent = addedContent(data);
          break;
        case 'undefined':
          addedContent = '';
          break;
        default:
          addedContent = addedContent;
      }

      return previous += current + addedContent;
    }, '');
    // make the string into the template's html
    template.innerHTML = content.trim();
    // put template into fragment
    fragment.appendChild(template.content);
    return fragment;
  };
};

export class HtmlTools {
  public render(elemContent: HTMLElement | DocumentFragment, container: HTMLElement) {
    container.appendChild(elemContent);
  }
}
