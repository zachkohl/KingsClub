# KingsClub
I created this application mainly for the experience of working with socket.io. The program is designed for use by a local Church that at the time needed a way to effectively make sure students returned home with the correct Legal Gaurdian. Lots of families unfortunately have complicated custody issues so this is a real concern. 

At the time of this software's construction (Fall 2018), I was volunteering as the front door security guy for said local Church's youth event. I was very concerned that my process would not be regerous enough to keep clear accountability of who belongs to who. That is where this application comes in. One page, /camera, allows for a file to be uploaded. This button can access the camera on a mobile phone. This was the intent, the security guard would access this page using his or her's mobile device and take a picture of the person in question. This picture is then dynamically displayed using socket.io on the primary registration page. The primary registration page was intended to be running on a laptop at the point of entry to the facility. If the photo looks good, the security personel can register the new adult or child by recording their name. The name is then associated with the photo, which is stored seperately on an Amazon S3 bucket. Children and adults can be registered this way and associated together. The idea being that one adult can in or out several children.

The end state of the project:
When adults arrive at the event with their children, they enter their personel adult name. This then brings up both their picture and the picture of each child. A simple button click is all that is necessary to sign in each child. When it is time to leave, this process is reversed. 

All the security personnel needs to do is check the photos for the adult and the children they are signing out. If the photos match the children, everything is good to go. Otherwise the children will not be allowed to leave. 

I got things mostly working with this project, even though the front end is ugly. It was a great learning experience at the time. Things developed with my personal life and I moved on to other volunteer work and other projects. But I still think the kingsclub app is pretty cool and a great demonstration of the power of socket.io to combine different hardware (cell phone and labtop) to achive something unique. 

Please as you review the code realize that this is not my most recent work. It is from last year when I was just getting into NodeJS.

-Zach. 
