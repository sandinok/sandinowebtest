
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_IMAGES = {
  bubble: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDEtMDhUMjA6MzU6NDQtMDY6MDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yMFQxOToyMToyNCswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMy0yMFQxOToyMToyNCswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozOTUyZmQ5OS1kYWY5LTA1NDQtYmM1MC1lYjE2MmUyMmM2M2YiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo3M2E1YmIxNS0zNDM0LTlhNDItYTRhMi1hNTNiZmZjZDU1NjAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphYzY0MzMzYS00NGViLTNkNDYtYmQ2Yi03YTVkODYwZGFhMDgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphYzY0MzMzYS00NGViLTNkNDYtYmQ2Yi03YTVkODYwZGFhMDgiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjBUMTk6MjE6MjQrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Mzk1MmZkOTktZGFmOS0wNTQ0LWJjNTAtZWIxNjJlMjJjNjNmIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTIwVDE5OjIxOjI0KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bNeihQAAC5tJREFUeJzVm3tw1NUVxz+/3c1CXrCEZyDhkQQpYKE8hgkPAwxQJggYhlHHMrZjxRHrOGm107TO6LSdVju109YRlT6GKQOCBDIMZQINDwMYCASoKDZECe9AAkl4ZLPZvefv3ce+s5sNkOL3P+/v3HN/v3PuPffce34RWmsqS0Sk91vrn98D3A/0A9oDnWs1uBnIA7KBTcDiQH35hdXll6ovXNKae64AK0n9gGXAVOrK4KmhDb0ZBt41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",
  leaf: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDEtMDhUMjA6MzU6NDQtMDY6MDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yMFQxOToyMTozNiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMy0yMFQxOToyMTozNiswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NjNjYzBlYS03ZWUzLTRkNDUtOGNlMS1jODdiYTYxYWQ0ZWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5OGM2OTBkNC1lMTU2LWJiNGEtOGY0OS1jNGVkNjdmZjE1ZDgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphZWNjYjgzMi0yYWQ2LTlmNGYtYTQwNS03OWFmYmJiNmQ3NGUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZWNjYjgzMi0yYWQ2LTlmNGYtYTQwNS03OWFmYmJiNmQ3NGUiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjBUMTk6MjE6MzYrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjYzY2MwZWEtN2VlMy00ZDQ1LThjZTEtYzg3YmE2MWFkNGVjIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTIwVDE5OjIxOjM2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+aegQ7wAADJFJREFUeJzFm3lwVdUZwH/33psgdUhhbVhiIEYQKGJLqDgEh8UBMRYGukA7gxZarW072A6dlpm267TTaetMkeJSlFHaCgpS0KK0FCjIUtZaICRACBQSE0LMQoDkvezeU/7xvvveyxIgL4kzv5k37937znd+55zvbOecK7TWPCSYbiagB8SIEemdYsXsxCCzgeEYIkNrzVAhukYAFRhkJMoUKBdCbALWALsNI6f8QQlyZxLgZnwAsBBYAIypPjGIlk/fQ3niEQANQmpMgdH9+gnUgwI4JaVYvS9nJXACWGIYxuZu06474a/6ctB0YBkwDUCeykffvYt+7RVc/eaglKL2zChqMh9DeiKeqtHCYFZSHw71iGdHxQU2XK3mRFVlS8FcDqwEFlmW9faCBYsqu4KGWyZAKWUuW5Y9CPg98DTgECdPYNXVYUQ6sMrPkTD7x5BUgJYGmuZPzRPRaKWQ0Wlo5Soz8HvXkV+5MpAGKv5JCZ8VV3P4XG3wM9uB14EvDMPI+UYEMNO8hPm3A2uBHs0vkqYMY0/FDTLiRUh+hRSoTZto2LUTHRWFcLlQt+7B9Orbb8HNGBmupKIBVlTJxS+fO1m4LLdglZPe+hciQCnlWLYs+3FgDTCg+cUhPRw8O7wnT8QlYB7YR/S0abjGjUc6HKBixQsINr+B2rQeLWOC31DBDAC1gNaorufXlDlJJK1YDqrd5+mGOLacrWHXmfpgpPuB14DPDcPYdksEZGZmOpRSPwOWAgHB45yS5+el8pObpXB0+UoAYp58EhEREXpNjED2d11HrVuDkIZPqGAf+RqfralCt3PdjJBhqmi8oZHktbqQFJlAXlkNbx2tC0Z6B3jRMIwNnSLAZfxI4BPgByHMeP55nt/lJblnAot6p7LmzNe4J07EPXFSh0KVAOdD6bjnPIHauBatfWxvZ3AKBtRew9i7GwnMNyL8krT2+6QNIyxCiJv2jMsQzBzYAyv8clXAi5Zl/WtBbm55h9nMzMx0WWb2UgzhUyHgefjKtAdYOziNhKJCnI8NQygLUVGBc9gw7Kyso8MLGRaFWbsGtWkdWjtCGNXaRmkdvB2E0KO1aHHdUi0l01J68EU3Eya4CtyJ8YeA18GckmV5XvfHji3LXNjBuLAsexjG3mY2rMInzuuKmTdicNOIrLjDxoHwvlRjAD6ma4dDdIlOPpsupT1GUt0VjK+3Ii0PMsYpMXbDZUXO0WpmpvRgYLyjeQ4ZYZrZr+cW5K7ypTqPorUWT65LL8DHYNEJ8WjL7iY2bzhEk7WuRnIPN6MSnFh1FjUfHqR+/3lUXcO3oStbNHrLriRCQF090lVzapP3q0MD7Ghr/5Ja35njz5hmthsRuTY7PaCGeXnyOqblMTKmjcadmYWIi6NhcyEiJgbXqFEIKTvdVWyBoRHK39eUQF1vQa0GZf/WPnXCCEZHSXZXt9W5O6CWBbm5R1stgiyzzIGIiCJA2uPpT+ckMakrb1F3L2LDRlyzZxPZowemx4NTSiisp0N4RvYlwufWgkcREO4xRIgxgiB18E/lnJnCBJ2aMpDSjZex2qeJ0xhjvyc3N/d8qwRYZtkCymshfmoaz00dDQOGgZCd+gJxYQdSh4iQGOQYChQgQnpIeOoLIGRESO5bQrS8r+0bkQQdZQVTB8SQs9kTSpOaLUOmtBojGA99OSmVGUseRsycMwSio2nI24qMjcU9ZlwAkEKiO6u0/pftl89JVL2PcC1B6xBJU36Jgw+HDnWo30h3H9ImUHiFC+9ZFFr7pry+vWIb0UoqaN28PNWC8UF9vSmJPIm7vBbBkWJGfgT9x4/AtXYtxowZRMbFY3o8OB2S4qDX0hokkG1gftRDyQ0P1CsgHlzM6IjYLa/bN4RCzeftGWBtc2qLvrLCtJBeHwGWWRYPnAX6AIzp5eTDzBxIHu7TVdXlHtR9Khaqd9M96JuS/2CEvGHArIEJvLSxIjTVWYyxn2qOgJeBP/skGJzgYPWsBZA2pkUXeSgBClrXCvuRUU7J159VhQ7IZsOyZ7cigIk0eSiQlOgK7Go+MQKI3nFUv27dO9uyFYd0uJ3EFNHNY1ECA832XGCO9k/P+94fzAOHjIAbcHbZMiJTU2ksOXFfMWwrjT0PLC86SdHF9r3KNGC21rpHMwKynf5QSmLt+k9BTJfm7YZNB2TSbU8uogUjR5BQWErD+XI2lVUFJ7sXg7JbENDz5LmnyG/swWZPFCkN1VQnDCQibQCDssYTtf0rqrNnI5xOyspO3zdEfhtK7VsGRkbxq2EPsfpUVXBST8uyxgQL7yRFnjLk3KOA9vpt4TPHIfI3cmnsOJQBYvBounX/GYZporf7B9g3A7/affxz1PAwDm9z2uUm4P1pFXw4wc9uJEfLKkJ3hgMsy0oLJiBR22YcazxnGmYIRfxTOchaQhEk5G7ENXoUfS9ewLt1I26nQvZNI4GD99XUvhNKpde7Wb3nJkuPRA6UXCC3vCo4vSc3JyBBNvZXd5FKQSgT2v6tUBLXsKFU9vPvAOOIJj1+OqzdctewZ66Jzt6re1W3JtfriWT1nuPBSb0wjJx+bcZ+I5jRDveAoP0B4b8u7AcLKRJSkdEOEhd8RP+3ribzyT4MP9Cd8a4JXCx5EO2yv5pfduccOzcU0yfeGfZ6sMw8FJzFZbtl7OwAMDw0VFaEVXbG9uEhazdw6dJQIlxOIt09mVCwF5LG4nCPRHiX2tu5ltiPP8Nm++EWdyrKSTh/Enl6P24jhQl9hjFiqDv4kZO1Jqeq6kLvnRHtG/D4ha+vDt+y1baNb2K0xMMUektms3/BV5SeHsfBisr2bzkllecvAyOIf+Ix0t78BJxJYdNaL0TIfQC1Tj8L95Vy6FK7sjMP7QsBQGYm7mb3fKvZ4EGwwSE9+xZYPG0nrfXx+noeqz+PvnsTRYMHcwRYe6YCRs/AO8e3v+1wiwiNToUVEvzhOBk9Ytp7pCouk5zdPswMQ4AjLLVzaH3T+6KlJA13L9asm8m89NIztX5dE+VnWZVz54w8Bzw66xt4N+Qj5k1D9ey4uSxzKvl4tJvPK2o5e+1aSMrrmZm576BSXaEM6OEfMRcu3IizPdr4RfMRmhI2nW+u+O6wI7BYU7AY78WrITtVK9TYxPTHYsJMaUJDTAcbVckdPgOK6q93lBya/j7Wnrc8iHDgWLgQkpJ861REQjxNUsMYBlYmQbau/YJKIampNVvmXF18nPigPnxCXFqzbl85Hwxzh/xH9KWLJGzYiHHPRMSx4+HZoSLCz99cfrW5HPbcFZ23xRLCKdBFQABUlYFzxFAiBbez3tXxoyftWrWeK+SAanMDFHFsE2byfCLTZ0HvBDTdICJDJ3Ft4Gvz2n1FQEM1ckQKssgDpxNRF8yYF1kxKI4rnhrudLZYWiP2rUe7B0LGnUNLrUO6T9UOe93ttuNKoksTF70c+TB17gsA1D1XAScOIWdOYkJSHAPi7S1vO+wGP8S9vsrGwcF0XFOn4NxVCMl9bcdrtudPNFAKVVMDxUVwby+I7gEm6JMmdbECZ+W08aS/+hq1ta3ed3ubJJZYliWF1kaAna2BNoshN27uEo91wi5KRiDuvR/ZK5lbf6N279UajxJS68HAwbAHDECeONpeT/idnRfVqMZGZDabxXeQ2VDGB7xArWRKaizJ2/ZQk5QMSUmI+BiI7xma3H8jxAhF9foXdfxY8dVzsPcslFWANwriYsAQKL0DOrGkfZDdQLSdBhjDvzMS2fRyHlXua7BnT3iH989UP7Uuih2oD90LNOHrTZS54KUFt/PkCcIRiRYiMNG3adN4AuOM+gYabzRCY6074Ci+LVhV5XDsLOIxy9Zv353D+Nr91ITtBjHRXNjzNY1eM2xFctNV4QFcb9etAgu5yt8VHpBVYHsV4XzSgqsPXLjnXTgFemW2SPYlIixrYTdH4cFqbvScMBjXPRPR+06E/7f424CmVeCx/ruBv+jGActxuW6emnsDo+4Kdfuyd9eMF4XWNa9mZrqEYSwGXkloqAv9y9MH5OvfJlTbiZBW8sSKZT1EON4FCl9f0M6Zf5Dw0aGiVqA356Z4Y+Jd3ItNfHuzwK2CQNyR0d8MzSp1kJDaw8WGfaVcqQ7/Y+oU8GfDMN5oZReoNYbp/wNlXcB4gP37VxA/7koP5s8fTdSuT4kv+rKVbArYBsw3jJztrRXrcBV49134gGu9gt/ggzqPwlkXx/XrNZ16j5PAYsPIWdEU7tOeVruzv8D1AS4v4acqkdA7Frz1LPvne+QXhJwOdAlmdvZ4DOMKyha+EhEi/FiLKLFyZUyP/0dffiAh1QPXSKoVfCEVfzHMnO3d9f1/AdOOxDIipvGCAAAAAElFTkSuQmCC",
  note: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGxmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDEtMDhUMjA6MzU6NDQtMDY6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA5LTI5VDE1OjQ4OjU1KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA5LTI5VDE1OjQ4OjU1KzAyOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmRmYWM0NTg1LTU0MGEtOTY0Yi1hYWJkLTUwYjY1N2ZmM2U1YSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjE0YzE2NzkzLTUyZTQtZWQ0MS1iMTQyLTQxYWEzZDcyNGM5MyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjM5MDJkZWYzLWZjMjMtZTg0OS04Yjk2LTY1ZjEyNjY4MTYwNCI+IDxkYzp0aXRsZT4gPHJkZjpBbHQ+IDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+TXVzaWMgRXZlbnQ8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozOTAyZGVmMy1mYzIzLWU4NDktOGI5Ni02NWYxMjY2ODE2MDQiIHN0RXZ0OndoZW49IjIwMjAtMDUtMDRUMTk6MTE6MzkrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGZhYzQ1ODUtNTQwYS05NjRiLWFhYmQtNTBiNjU3ZmYzZTVhIiBzdEV2dDp3aGVuPSIyMDIwLTA5LTI5VDE1OjQ4OjU1KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6D88wjAAAMJElEQVR4nMWbe4xcVR3HP+fOzO6WUtrCIgVaKK0IfaHAttSItkhLg5AGMFEN8Q8FIgVUfCAIJCZG0cRXSH3FhP+MTSQay0NDI0qtAkpbtWFpy65dedVuu9vuY2bu8Y/fuefee2fvzJ3ZlpPc7My9vznn9/7dxznnLsw156mREBG5dvW5zcDlwJeBTwMX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"
};

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create image objects for each particle type
    const images: { [key: string]: HTMLImageElement } = {};
    Object.entries(PARTICLE_IMAGES).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      images[key] = img;
    });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Partículas de diferentes tipos con información de capa para efecto parallax
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      type: 'bubble' | 'leaf' | 'note' | 'sparkle';
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      layer: number; // 1 = front, 2 = middle, 3 = back (for parallax)
    }> = [];

    // Crear partículas iniciales con distribución por capas
    for (let i = 0; i < 80; i++) {
      const layer = Math.floor(Math.random() * 3) + 1; // 1, 2 or 3
      const layerFactor = 1 / layer; // Particles in back layers move slower
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8 * layerFactor,
        vy: -Math.random() * 0.8 * layerFactor - 0.1,
        size: Math.random() * 10 + 10 + (3 - layer) * 5, // Bigger particles in front layers
        type: ['bubble', 'leaf', 'note', 'sparkle'][Math.floor(Math.random() * 4)] as any,
        opacity: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02 * layerFactor,
        layer: layer
      });
    }

    // Track mouse for interactive particles
    const mouse = { x: 0, y: 0, moving: false };
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.moving = true;
      
      // Check if we should create a sparkle
      if (Math.abs(mouse.x - lastMouseX) > 5 || Math.abs(mouse.y - lastMouseY) > 5) {
        // Add a sparkle at mouse position
        if (Math.random() > 0.7) {
          particles.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 8 + 4,
            type: 'sparkle',
            opacity: 0.9,
            rotation: 0,
            rotationSpeed: 0,
            layer: 1
          });
        }
        
        lastMouseX = mouse.x;
        lastMouseY = mouse.y;
      }
      
      // Reset moving flag after a delay
      setTimeout(() => {
        mouse.moving = false;
      }, 100);
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // We'll render particles by layer, starting with the back layer
      for (let layer = 3; layer >= 1; layer--) {
        const layerParticles = particles.filter(p => p.layer === layer);
        
        layerParticles.forEach((particle, index) => {
          // Actualizar posición
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.rotation += particle.rotationSpeed;
          
          // Interactividad con el ratón
          if (mouse.moving && layer === 1) {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              const force = 0.2 * (1 - dist / 100);
              particle.vx += -dx * force / dist;
              particle.vy += -dy * force / dist;
            }
          }

          // Aplicar un poco de aceleración según el tipo de partícula
          if (particle.type === 'bubble') {
            particle.vy -= 0.003; // Burbujas suben
          } else if (particle.type === 'leaf') {
            particle.vx += Math.sin(Date.now() * 0.001 + index) * 0.01; // Hojas oscilan
            particle.vy += 0.005; // Hojas caen lentamente
          } else if (particle.type === 'note') {
            particle.vx = Math.sin(Date.now() * 0.001 + index) * 0.3; // Notas oscilan lateralmente
            particle.vy -= 0.001; // Notas suben lentamente
          }

          // Limitar velocidad máxima
          const maxSpeed = 2;
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          if (speed > maxSpeed) {
            particle.vx = (particle.vx / speed) * maxSpeed;
            particle.vy = (particle.vy / speed) * maxSpeed;
          }

          // Resetear partículas que salen de la pantalla
          if (particle.y < -50) {
            particle.y = canvas.height + 50;
            particle.x = Math.random() * canvas.width;
          }
          if (particle.y > canvas.height + 50) {
            particle.y = -50;
            particle.x = Math.random() * canvas.width;
          }
          if (particle.x < -50) {
            particle.x = canvas.width + 50;
          }
          if (particle.x > canvas.width + 50) {
            particle.x = -50;
          }

          // Dibujar partícula según tipo con imágenes
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          ctx.globalAlpha = particle.opacity;
          
          if (images[particle.type] && images[particle.type].complete) {
            const size = particle.size * 2;
            ctx.drawImage(
              images[particle.type], 
              -size/2, 
              -size/2, 
              size, 
              size
            );
          }
          
          ctx.restore();
        });
      }

      requestAnimationFrame(animate);
    };

    // Wait for images to load
    const loadImages = () => {
      let allLoaded = true;
      Object.values(images).forEach(img => {
        if (!img.complete) allLoaded = false;
      });

      if (allLoaded) {
        animate();
      } else {
        setTimeout(loadImages, 100);
      }
    };

    loadImages();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
