
class LanguageService {

	static getCurrentLanguage() {

		const locale = localStorage.getItem('locale');

		return locale;
	}

}

export default LanguageService;
