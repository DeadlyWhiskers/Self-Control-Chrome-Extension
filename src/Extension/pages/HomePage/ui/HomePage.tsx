import { WebsiteList } from "../../../widgets/WebsiteList";
import { AddWebsiteComponent } from "../../../widgets/AddWebsiteComponent";

export const HomePage = () => {
    return (
        <div className="list-layout">
            <WebsiteList/>
            <AddWebsiteComponent />
        </div>
    );  
};
